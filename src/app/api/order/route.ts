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
} from "firebase/firestore";
import { Order } from "../../../../types/types";
import { cookies } from "next/headers";



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
      cartItems.map(async (item: { productId: string; quantity: number }) => {
        const productRef = doc(db, "products", item.productId);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          console.warn(`Product ${item.productId} not found, skipping...`);
          return null;
        }

        const productData = productSnap.data();
        const price = productData?.pricing?.[0]?.price || 0; 

        totalAmount += item.quantity * price;

        return {
          productId: item.productId,
          quantity: item.quantity,
          price,
        };
      })
    );

    // ✅ Remove Null Items (if any product was missing)
    const filteredCartItems = finalCartItems.filter(Boolean);

    if (filteredCartItems.length === 0) {
      return NextResponse.json({ success: false, error: "No valid products found in cart" }, { status: 400 });
    }

    // ✅ Create New Order in Firestore (Before Shiprocket API Call)
    const newOrder = {
      userId,
      items: filteredCartItems,
      totalAmount,
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
      // ✅ Fetch a Single Order
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
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
