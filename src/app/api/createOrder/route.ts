import axios from "axios";
import { NextResponse } from "next/server";
import { db } from "../../../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";




export async function POST(req: Request) {
  try {
    const { orderId, userId } = await req.json();

    if (!orderId || typeof orderId !== "string" || !orderId.trim()) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }
    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    // ✅ Fetch the order — the single source of truth for the payable amount
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const orderData = orderSnap.data();
    if (orderData.userId !== userId) {
      return NextResponse.json({ success: false, error: "Not authorized to pay for this order" }, { status: 403 });
    }

    // COD → 15% advance stored on the order; ONLINE → full order total.
    // The charged amount is ALWAYS derived server-side — never trusted from the client.
    const expectedAmount =
      orderData.paymentMethod === "COD"
        ? Number(orderData.codAdvanceAmount) || 0
        : Number(orderData.totalAmount) || 0;
    const amountInPaise = Math.round(expectedAmount * 100);

    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      return NextResponse.json({ success: false, error: "Invalid payable amount for this order" }, { status: 400 });
    }

    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/phone-pe`, {
      amount: amountInPaise,
      merchantOrderId: orderId,
    });
    const { redirectUrl } = res.data;
    return NextResponse.json({ success: true, redirectUrl });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
