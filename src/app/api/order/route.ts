import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../utils/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  where,
  query,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Order } from "../../../../types/types";
import { cookies } from "next/headers";
import { COD_ADVANCE_PERCENT, PaymentMethod, resolveCartPaymentRules, roundCurrency } from "@/lib/paymentEligibility";




// ✅ Fetch Shiprocket Tracking ID
// async function getTrackingId(orderId: string) {
//     try {
//         const response = await axios.get(
//             `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`,
//             {
//                 headers: { Authorization: `Bearer ${SHIPROCKET_TOKEN}` },
//             }
//         );

//         return response.data?.shipment?.[0]?.awb_code || null;
//     } catch (error) {
//         console.error("Error fetching Shiprocket tracking ID:", error);
//         return null;
//     }
// }

// ✅ Create Order & Store Tracking ID in Firestore
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;
    const paymentMethod = (body.paymentMethod ?? "ONLINE") as PaymentMethod;
    if (!["ONLINE", "COD", "FULL_COD"].includes(paymentMethod)) {
      return NextResponse.json({ success: false, error: "Invalid payment method" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    // ✅ Fetch user data from Firestore
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    const cartItems = userData?.cart || [];

    if (cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    // ✅ Calculate Total Amount
    let totalAmount = 0;
    const finalCartItems = await Promise.all(
      cartItems.map(async (item: { productId: string; quantity: number; price?: number; name?: string; packageSize?: string }) => {
        const productRef = doc(db, "products", item.productId);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          console.warn(`Product ${item.productId} not found, skipping...`);
          return null;
        }

        const productData = productSnap.data();

        const productEligibility = productData?.paymentEligibility;

        // Prefer the cart's stored selling price (respects package size & discount);
        // fall back to the first pricing tier for legacy cart items without a price
        const rawPrice =
          typeof item.price === "number" && item.price > 0
            ? item.price
            : productData?.pricing?.[0]?.price || 0;
        // Normalize to paise precision — kills float artifacts like 123.45000000000001
        const price = Math.round(rawPrice * 100) / 100;

        totalAmount += item.quantity * price;

        return {
          productId: item.productId,
          name: productData?.name || item.name || "Unnamed Product",
          packageSize: item.packageSize || "",
          quantity: item.quantity,
          price,
          codAvailable: productData?.codAvailable !== false,
          paymentEligibility: productEligibility,
        };
      })
    );

    // ✅ Remove Null Items (if any product was missing)
    const filteredCartItems = finalCartItems.filter(Boolean);

    if (filteredCartItems.length === 0) {
      return NextResponse.json({ success: false, error: "No valid products found in cart" }, { status: 400 });
    }

    // ✅ COD split payment: 15% is paid ONLINE upfront, the remaining 85% is
    //    collected in cash on delivery. No surcharge — the order total is unchanged.
    //    All amounts are normalized to paise precision.
    const subtotalAmount = Math.round(totalAmount * 100) / 100;
    const couponRef = doc(db, "coupons", "active");
    const couponSnap = await getDoc(couponRef);
    const couponData = couponSnap.exists() ? couponSnap.data() : null;
    const couponDiscountPercent = Number(couponData?.discount) || 0;
    const couponIsActive =
      couponDiscountPercent > 0 &&
      couponDiscountPercent <= 100 &&
      (!couponData?.expiresAt || Number(couponData.expiresAt) > Date.now());
    const couponDiscountAmount = couponIsActive
      ? Math.round(subtotalAmount * couponDiscountPercent) / 100
      : 0;
    const shippingCharges = 0;
    const taxAmount = 0;
    totalAmount = Math.round((subtotalAmount - couponDiscountAmount + shippingCharges + taxAmount) * 100) / 100;
    const paymentRules = resolveCartPaymentRules(filteredCartItems, totalAmount);
    if (!paymentRules.allowedMethods.includes(paymentMethod)) {
      return NextResponse.json({ success: false, error: `This cart does not allow ${paymentMethod}. Available methods: ${paymentRules.allowedMethods.join(", ")}.` }, { status: 400 });
    }
    const fullCodAllowed = paymentRules.allowedMethods.includes("FULL_COD");
    const codAdvanceAmount =
      paymentMethod === "COD" ? roundCurrency((totalAmount * COD_ADVANCE_PERCENT) / 100) : 0;
    const codDueAmount =
      paymentMethod === "COD" ? roundCurrency(totalAmount - codAdvanceAmount) : paymentMethod === "FULL_COD" ? totalAmount : 0;
    const paymentRestriction = paymentRules.restriction;

    // ✅ Create New Order in Firestore (Before Shiprocket API Call)
    const newOrder = {
      userId,
      items: filteredCartItems,
      totalAmount,
      subtotalAmount,
      couponDiscountAmount,
      couponCode: couponIsActive ? couponData?.code || null : null,
      shippingCharges,
      taxAmount,
      fullCodAllowed,
      paymentRestriction,
      allowedPaymentMethods: paymentRules.allowedMethods,
      paymentMethod,
      codAdvanceAmount,
      codDueAmount,
      paymentVerified: false, // set true by /api/verifyOrder after PhonePe confirms amount + state
      status: "pending",
      createdAt: new Date().toISOString(),
      shiprocketTrackingId: "Fetching...",  // Temporary tracking ID
    };

    const orderDocRef = await addDoc(collection(db, "orders"), newOrder);
    const orderId = orderDocRef.id;

    // ✅ Call Shiprocket API to Get Tracking ID
    // let trackingId: string | null = null;
    // if (SHIPROCKET_TOKEN) {
    //   try {
    //     const shiprocketResponse = await axios.post(
    //       "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    //       {
    //         order_id: orderId,
    //         order_date: new Date().toISOString(),
    //         pickup_location: "Primary", // Modify as per your Shiprocket settings
    //         billing_customer_name: shippingDetails.name,
    //         billing_address: shippingDetails.line1,
    //         billing_address_2: shippingDetails.line2 || "",
    //         billing_city: shippingDetails.city,
    //         billing_pincode: shippingDetails.zip,
    //         billing_state: shippingDetails.state,
    //         billing_country: "India",
    //         billing_phone: shippingDetails.phone,
    //         order_items: filteredCartItems.map((item) => ({
    //           name: item.productId,
    //           sku: item.productId,
    //           units: item.quantity,
    //           selling_price: item.price,
    //         })),
    //       },
    //       { headers: { Authorization: `Bearer ${SHIPROCKET_TOKEN}` } }
    //     );

    //     const shiprocketOrderId = shiprocketResponse.data?.order_id || null;
    //     trackingId = await getTrackingId(shiprocketOrderId);

    //     // ✅ Update Firestore Order with Tracking ID
    //     await updateDoc(orderDocRef, { shiprocketTrackingId: trackingId || "Not Available" });
    //   } catch (error) {
    //     console.error("Shiprocket API error:", error);
    //   }
    // }
    (await cookies()).set('orderId',orderId,{httpOnly:true,maxAge:1000})
    return NextResponse.json(
      { success: true, data: { id: orderId, ...newOrder },msg:"Order Id saved in cookies" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, error: "Error creating order" }, { status: 500 });
  }
}

// ✅ Fetch Order Details
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const orderId = url.searchParams.get("orderId");

    if (orderId) {
      // ✅ Fetch a Single Order — requires the owner's userId
      if (!userId) {
        return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
      }
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      if (orderSnap.data()?.userId !== userId) {
        return NextResponse.json({ success: false, error: "Not authorized to view this order" }, { status: 403 });
      }

      return NextResponse.json(
        { success: true, data: { id: orderSnap.id, ...orderSnap.data() }, msg: "Order fetched successfully" },
        { status: 200 }
      );
    } else if (userId) {
      // ✅ Fetch All Orders of a User
      const ordersQuery = query(collection(db, "orders"), where("userId", "==", userId));
      const ordersSnap = await getDocs(ordersQuery);

      const orders: Order[] = ordersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      return NextResponse.json(
        { success: true, data: orders, msg: `Fetched all orders of user ${userId}` },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ success: false, error: "User ID or Order ID is required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, msg: "Error fetching orders", error }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status, userId } = await req.json();

    if (!orderId || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId or userId in request body" },
        { status: 400 }
      );
    }

    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ Only the order's owner may change its status
    if (orderSnap.data()?.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to update this order" },
        { status: 403 }
      );
    }

    const orderData = orderSnap.data();
    const allowedStatuses = ["Payment Failed", "COD Advance Paid - Ready to Ship", "Payment Verified - Ready to Ship!", "Full COD Confirmed - Ready to Ship"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid order status update" }, { status: 400 });
    }
    if (status !== "Payment Failed" && orderData?.paymentMethod !== "FULL_COD" && !orderData?.paymentVerified) {
      return NextResponse.json({ success: false, error: "Payment must be verified before confirming an order" }, { status: 409 });
    }
    if (status === "Payment Failed" && orderData?.paymentVerified) {
      return NextResponse.json({ success: false, error: "A verified payment cannot be marked failed" }, { status: 409 });
    }

    await updateDoc(orderRef, { status });

    return NextResponse.json(
      { success: true, message: "Order status updated to shipping" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
