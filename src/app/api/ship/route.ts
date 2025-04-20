import axios from "axios";
import { db } from "../../../../utils/firebase";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";



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
    cart?: CartItem[];
    email:string
}

// ✅ POST method to handle Shiprocket order creation
export async function POST(request: Request) {
    console.log("API call initiated: /api/ship");

    try {
        const body = await request.json();
        const { userId, paymentMethod = "Prepaid" }: { userId: string; paymentMethod?: string } = body;

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
        const cartItems = userData?.cart || [];
        const orderId =String((await cookies()).get('orderId')?.value);

        const orderRef = doc(db,"orders",orderId);


        console.log("Fetched Address:", address);
        console.log("Fetched Cart Items:", cartItems);
        console.log("Payment Method:", paymentMethod);
        console.log("Fetching OrderId",orderId)

        if (!address) {
            console.error("No valid address found for the user.");
            return NextResponse.json(
                { success: false, error: "No valid address found." },
                { status: 400 }
            );
        }

        if (cartItems.length === 0) {
            console.error("The cart is empty for the user.");
            return NextResponse.json(
                { success: false, error: "Cart is empty." },
                { status: 400 }
            );
        }
        if(!orderId){
            console.log("Error while getting orderId form cookies");
            return NextResponse.json({
                success:false, error:"Order Id error while fetching from cookies !"
            },{status:404})
        }

        const token = process.env.SHIPROCKET_API_TOKEN;

        if (!token) {
            console.error("Shiprocket API token is missing.");
            return NextResponse.json(
                { success: false, error: "Shiprocket API token is not configured." },
                { status: 500 }
            );
        }

        console.log("Shiprocket API Token acquired.");

        // ✅ Prepare the order data for Shiprocket
        const orderItems = cartItems.map((item: CartItem) => ({
            name: item.name,
            sku: item.productId || `SKU_${item.name.replace(/\s+/g, "_").toUpperCase()}`,
            units: item.quantity,
            selling_price: item.price,
            discount: 0,
            tax: 0,
            hsn: 44122,
        }));

        // Determine the correct payment method string for Shiprocket
        const shiprocketPaymentMethod = paymentMethod === "COD" ? "COD" : "Prepaid";
        
        const orderData = {
            order_id: orderId,
            order_date: new Date().toISOString().slice(0, 10),
            pickup_location: 'Primary',
            billing_customer_name: address.name,
            billing_last_name: "",
            billing_address: address.line1,
            billing_address_2: address.line2 || "",
            billing_city: address.city,
            billing_pincode: parseInt(address.zip, 10),
            billing_state: address.state,
            billing_country: address.country || "India",
            billing_email: userData.email,
            billing_phone: parseInt(address.phone, 10),
            shipping_is_billing: true,
            order_items: orderItems,
            payment_method: shiprocketPaymentMethod,
            shipping_charges: 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: 0,
            sub_total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
            length: 10.0,
            breadth: 15.0,
            height: 20.0,
            weight: 1.0,
        };

        console.log("Prepared Order Data:", JSON.stringify(orderData, null, 2));

        // ✅ Create the order in Shiprocket
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
        
        console.log("Shiprocket API Response:", response.data,response.data.data);
        await updateDoc(orderRef, { shiprocketTrackingId: response.data.order_id || "Not Available" });
        return NextResponse.json({ success: true, data: response.data });
    } catch (error: unknown) {
        console.error("Shiprocket Order Error:", error);
        if (axios.isAxiosError(error) && error.response) {
            console.error("Error Response Data:", error.response.data);
            return NextResponse.json(
                { success: false, error: error.response.data.message || "Failed to create Shiprocket order." },
                { status: error.response.status }
            );
        }
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
