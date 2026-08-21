import axios from "axios";
import { db } from "../../../../utils/firebase";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import ShiprocketTokenManager from "@/lib/shiprocketAuth";



const SHIPROCKET_API_BASE = "https://apiv2.shiprocket.in/v1/external";

interface CartItem {
    name: string;
    productId?: string;
    quantity: number;
    price: number;
}

interface Address {
    name:string,
    line1: string;
    line2?: string;
    city: string;
    zip: string;
    state: string;
    country: string;
    phone: string;
}

interface UserData {
    address?: Address; // ✅ Now storing only one address (not an array)
    email:string
}

// ✅ POST method to handle Shiprocket order creation
export async function POST(request: Request) {
    console.log("API call initiated: /api/ship");

    try {
        const body = await request.json();
        const { userId, orderId }: { userId: string; paymentMethod?: string; orderId?: string } = body;

        console.log("Received Request Body:", body);

        if (!userId) {
            console.error("User ID is missing in the request.");
            return NextResponse.json(
                { success: false, error: "User ID is required" },
                { status: 400 }
            );
        }

        // ✅ Fetch user data from Firebase
        console.log(`Fetching user data for userId: ${userId}`);
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.error(`User not found for userId: ${userId}`);
            return NextResponse.json(
                { success: false, error: "User not found." },
                { status: 404 }
            );
        }

        const userData = userSnap.data() as UserData;
        const address = userData?.address || null; // ✅ Now fetching as a single object

        console.log("Fetched Address:", address);
        console.log("OrderId:", orderId);

        if (!address) {
            console.error("No valid address found for the user.");
            return NextResponse.json(
                { success: false, error: "No valid address found." },
                { status: 400 }
            );
        }

        // ✅ Order ID must come from the client (the confirmation page has it from the
        //    payment redirect) — never from a cookie that may be missing or stale.
        if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
            console.error("Missing orderId in request body.");
            return NextResponse.json(
                { success: false, error: "Order ID is required." },
                { status: 400 }
            );
        }

        // ✅ Fetch the order — it is the single source of truth for items & amounts
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            console.error(`Order not found: ${orderId}`);
            return NextResponse.json(
                { success: false, error: "Order not found." },
                { status: 404 }
            );
        }

        const orderDoc = orderSnap.data();

        if (orderDoc.userId !== userId) {
            console.error(`User ${userId} is not the owner of order ${orderId}`);
            return NextResponse.json(
                { success: false, error: "Not authorized for this order." },
                { status: 403 }
            );
        }

        if (orderDoc.paymentMethod !== "FULL_COD" && !orderDoc.paymentVerified) {
            return NextResponse.json(
                { success: false, error: "Advance payment has not been verified for this order." },
                { status: 409 }
            );
        }

        // ✅ Idempotency: never create a second Shiprocket order for the same order
        const existingTrackingId = orderDoc.shiprocketTrackingId;
        if (existingTrackingId && existingTrackingId !== "Fetching..." && existingTrackingId !== "Not Available") {
            console.log(`Shiprocket order already exists for ${orderId} (${existingTrackingId}) — skipping duplicate creation.`);
            return NextResponse.json({ success: true, data: { order_id: existingTrackingId, alreadyCreated: true } });
        }

        const orderItemsInput: CartItem[] = Array.isArray(orderDoc.items) ? orderDoc.items : [];
        if (orderItemsInput.length === 0) {
            console.error(`Order ${orderId} has no items.`);
            return NextResponse.json(
                { success: false, error: "Order has no items." },
                { status: 400 }
            );
        }

        // ✅ Normalize phone (+91 prefix / spaces / dashes → 10 digits) and pincode
        const phoneDigits = String(address.phone || "").replace(/\D/g, "");
        const phone10 = phoneDigits.length > 10 ? phoneDigits.slice(-10) : phoneDigits;
        if (phone10.length !== 10) {
            return NextResponse.json(
                { success: false, error: "Invalid phone number in address (10 digits required)." },
                { status: 400 }
            );
        }
        const pincode = String(address.zip || "").replace(/\D/g, "");
        if (pincode.length !== 6) {
            return NextResponse.json(
                { success: false, error: "Invalid pincode in address (6 digits required)." },
                { status: 400 }
            );
        }

        // Get valid token from token manager
        const tokenManager = ShiprocketTokenManager.getInstance();
        const token = await tokenManager.getValidToken();

        console.log("Shiprocket API Token acquired from token manager.");

        // ✅ Prepare the order data for Shiprocket — items & amounts come from the
        //    ORDER DOCUMENT (not the live cart, which may have changed or been cleared)
        const round2 = (n: number) => Math.round(n * 100) / 100;

        // Determine the correct payment method string for Shiprocket
        const storedPaymentMethod = orderDoc.paymentMethod;
        if (!["ONLINE", "COD", "FULL_COD"].includes(storedPaymentMethod)) {
            return NextResponse.json({ success: false, error: "Order has an invalid payment method." }, { status: 409 });
        }
        const shiprocketPaymentMethod = storedPaymentMethod === "ONLINE" ? "Prepaid" : "COD";

        const fullSubTotal = round2(
            orderItemsInput.reduce((acc, item) => acc + round2(Number(item.price) || 0) * item.quantity, 0)
        );

        // ✅ COD split payment: the 15% advance was ALREADY collected online via PhonePe.
        //    Shiprocket has no "advance paid" field, and passing it as `total_discount`
        //    mislabels it as a discount in the panel — so a split-COD shipment is created
        //    at the COLLECTABLE value only (the 85% due): item prices are scaled down
        //    proportionally, total_discount stays 0, and the advance is noted in `comment`.
        const codDueAmount = storedPaymentMethod === "COD" ? Number(orderDoc.codDueAmount) || 0 : 0;
        const isSplitCod =
            storedPaymentMethod === "COD" && codDueAmount > 0 && fullSubTotal > 0;
        const targetShipmentValue = storedPaymentMethod === "COD" ? codDueAmount : Number(orderDoc.totalAmount) || fullSubTotal;
        const collectable = targetShipmentValue;
        const priceFactor = fullSubTotal > 0 ? targetShipmentValue / fullSubTotal : 1;

        const orderItems = orderItemsInput.map((item: CartItem) => ({
            name: item.name || item.productId || "Item",
            sku: item.productId || `SKU_${String(item.name || "ITEM").replace(/\s+/g, "_").toUpperCase()}`,
            units: item.quantity,
            selling_price: round2((Number(item.price) || 0) * priceFactor),
            discount: 0,
            tax: 0,
            hsn: 44122,
        }));

        // sub_total must stay consistent with the itemized list (paise precision)
        let subTotal = round2(orderItems.reduce((acc, item) => acc + item.selling_price * item.units, 0));

        // Fix paise-level rounding drift so the courier collects EXACTLY the due amount
        if (orderItems.length > 0) {
            const drift = round2(collectable - subTotal);
            if (drift !== 0) {
                const singleUnitIdx = orderItems.findIndex((i) => i.units === 1);
                const target = singleUnitIdx >= 0 ? singleUnitIdx : 0;
                const adjustment = singleUnitIdx >= 0 ? drift : drift / orderItems[0].units;
                orderItems[target].selling_price = round2(orderItems[target].selling_price + adjustment);
                subTotal = round2(orderItems.reduce((acc, item) => acc + item.selling_price * item.units, 0));
            }
        }

        // The advance was a payment, not a discount — never sent as total_discount.
        const totalDiscount = 0;
        const codAdvancePaid = isSplitCod
            ? Number(orderDoc.codAdvanceAmount) || round2(fullSubTotal - collectable)
            : 0;
        const orderComment = isSplitCod
            ? `COD split: ₹${codAdvancePaid} advance already paid online via PhonePe. Collect ₹${collectable} on delivery. (Full order value ₹${fullSubTotal})`
            : "";

        const orderData = {
            order_id: orderId,
            order_date: new Date().toISOString().slice(0, 10),
            pickup_location: 'Primary',
            billing_customer_name: address.name,
            billing_last_name: "",
            billing_address: address.line1,
            billing_address_2: address.line2 || "",
            billing_city: address.city,
            billing_pincode: Number(pincode),
            billing_state: address.state,
            billing_country: address.country || "India",
            billing_email: userData.email,
            billing_phone: Number(phone10),
            shipping_is_billing: true,
            order_items: orderItems,
            payment_method: shiprocketPaymentMethod,
            shipping_charges: 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: totalDiscount,
            sub_total: subTotal,
            comment: orderComment,
            length: 10.0,
            breadth: 15.0,
            height: 20.0,
            weight: 1.0,
        };

        console.log("Prepared Order Data:", JSON.stringify(orderData, null, 2));

        // ✅ Create the order in Shiprocket
        try {
            const response = await axios.post(
                `${SHIPROCKET_API_BASE}/orders/create/adhoc`,
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Shiprocket API Response:", response.data, response.data.data);
            await updateDoc(orderRef, { shiprocketTrackingId: response.data.order_id || "Not Available" });
            return NextResponse.json({ success: true, data: response.data });
        } catch (shipError: unknown) {
            if (axios.isAxiosError(shipError) && shipError.response) {
                console.error("Shiprocket Error Response Data:", shipError.response.data);
                // Shiprocket rejects a re-created order_id — treat as already created
                // so confirmation-page retries don't show a false failure.
                const errText = JSON.stringify(shipError.response.data || {});
                if (/duplicat|already/i.test(errText)) {
                    console.warn(`Shiprocket reports the order already exists for ${orderId} — treating as created.`);
                    try {
                        await updateDoc(orderRef, { shiprocketTrackingId: orderId });
                    } catch (e) {
                        console.warn("Could not persist fallback tracking id:", e);
                    }
                    return NextResponse.json({ success: true, data: { order_id: orderId, duplicate: true } });
                }
                return NextResponse.json(
                    { success: false, error: shipError.response.data.message || "Failed to create Shiprocket order." },
                    { status: shipError.response.status }
                );
            }
            throw shipError; // non-axios errors go to the outer catch
        }
    } catch (error: unknown) {
        console.error("Shiprocket Order Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create Shiprocket order." },
            { status: 500 }
        );
    }
}

// ✅ GET method to handle unsupported requests
export async function GET() {
    return NextResponse.json(
        { success: false, error: "GET method not allowed" },
        { status: 405 }
    );
}
