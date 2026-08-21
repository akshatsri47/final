import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Env, RefundRequest, StandardCheckoutClient } from "pg-sdk-node";
import { db } from "../../../../../utils/firebase";

const clientId = process.env.PHONE_PE_CLIENT_ID || "";
const clientSecret = process.env.PHONE_PE_CLIENT_SECRET || "";
const clientVersion = Number(process.env.PHONE_PE_CLIENT_VERSION) || 1;
const environment = process.env.PHONE_PE_ENVIRONMENT === "PRODUCTION" ? Env.PRODUCTION : Env.SANDBOX;
const phonePe = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, environment);

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId");
    const userId = req.nextUrl.searchParams.get("userId");
    if (!orderId || !userId) return NextResponse.json({ success: false, error: "Order ID and user ID are required" }, { status: 400 });
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    const order = orderSnap.data();
    if (order.userId !== userId) return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    if (!order.refundId) return NextResponse.json({ success: true, refundState: order.refundState || "NOT_REQUIRED" });
    const response = await phonePe.getRefundStatus(order.refundId);
    const refundState = response.state || "PENDING";
    await updateDoc(orderRef, { refundState, refundCheckedAt: new Date().toISOString() });
    return NextResponse.json({ success: true, refundId: order.refundId, refundState });
  } catch (error) {
    console.error("Refund status check failed", error);
    return NextResponse.json({ success: false, error: "Unable to check refund status" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, userId } = await req.json();
    if (!orderId || !userId) return NextResponse.json({ success: false, error: "Order ID and user ID are required" }, { status: 400 });

    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    const order = orderSnap.data();
    if (order.userId !== userId) return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    if (order.shiprocketTrackingId && order.shiprocketTrackingId !== "Fetching..." && order.shiprocketTrackingId !== "Not Available") {
      return NextResponse.json({ success: false, error: "Dispatched orders cannot be cancelled online" }, { status: 409 });
    }
    if (order.cancelledAt) return NextResponse.json({ success: true, refundState: order.refundState || "NOT_REQUIRED" });

    const refundAmount = Number(order.paidAmount) || 0;
    if (!order.paymentVerified || refundAmount <= 0) {
      await updateDoc(orderRef, { status: "Cancelled", cancelledAt: new Date().toISOString(), refundState: "NOT_REQUIRED" });
      return NextResponse.json({ success: true, refundState: "NOT_REQUIRED" });
    }
    if (!clientId || !clientSecret) return NextResponse.json({ success: false, error: "Refund service is not configured" }, { status: 500 });

    const merchantRefundId = `refund_${orderId}_${Date.now()}`;
    const response = await phonePe.refund(RefundRequest.builder().amount(Math.round(refundAmount * 100)).merchantRefundId(merchantRefundId).originalMerchantOrderId(orderId).build());
    await updateDoc(orderRef, { status: "Cancelled", cancelledAt: new Date().toISOString(), refundId: response.refundId || merchantRefundId, refundState: response.state || "PENDING" });
    return NextResponse.json({ success: true, refundId: response.refundId || merchantRefundId, refundState: response.state || "PENDING" });
  } catch (error) {
    console.error("Order cancellation/refund failed", error);
    return NextResponse.json({ success: false, error: "Unable to cancel order and start refund" }, { status: 500 });
  }
}
