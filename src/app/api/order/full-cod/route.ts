import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { db } from "../../../../../utils/firebase";

export async function POST(req: NextRequest) {
  try {
    const { orderId, userId } = await req.json();
    if (!orderId || !userId) {
      return NextResponse.json({ success: false, error: "Order ID and user ID are required" }, { status: 400 });
    }

    const orderRef = doc(db, "orders", orderId);
    const orderSnapshot = await getDoc(orderRef);
    if (!orderSnapshot.exists()) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const initialOrder = orderSnapshot.data();
    if (initialOrder.userId !== userId) {
      return NextResponse.json({ success: false, error: "Not authorized to update this order" }, { status: 403 });
    }

    for (const item of initialOrder.items || []) {
      const productSnapshot = await getDoc(doc(db, "products", item.productId));
      if (!productSnapshot.exists() || productSnapshot.data().isOutOfStock === true) {
        return NextResponse.json({ success: false, error: `${item.name || "A product"} is out of stock` }, { status: 409 });
      }
    }

    const result = await runTransaction(db, async (transaction) => {
      const currentSnapshot = await transaction.get(orderRef);
      if (!currentSnapshot.exists()) throw new Error("Order not found");
      const order = currentSnapshot.data();

      if (order.userId !== userId) throw new Error("Not authorized to update this order");
      if (order.paymentVerified) throw new Error("This payment has already been completed");

      if (order.paymentMethod === "FULL_COD" && order.status === "Full COD Pending Confirmation") {
        return { totalAmount: Number(order.totalAmount) || 0 };
      }

      if (order.status !== "Payment Failed") {
        throw new Error("Full COD is available only after a failed payment");
      }
      if (!order.fullCodAllowed || !order.allowedPaymentMethods?.includes("FULL_COD")) {
        throw new Error("Full COD is not available for this order");
      }

      const fullCodAmount = Number(order.totalBeforePaymentDiscount ?? order.totalAmount) || 0;
      if (fullCodAmount <= 0) throw new Error("Invalid order amount");

      transaction.update(orderRef, {
        fallbackFromPaymentMethod: order.paymentMethod,
        paymentMethod: "FULL_COD",
        totalAmount: fullCodAmount,
        onlinePaymentDiscountPercent: 0,
        onlinePaymentDiscountAmount: 0,
        codAdvanceAmount: 0,
        codDueAmount: fullCodAmount,
        status: "Full COD Pending Confirmation",
        convertedToFullCodAt: new Date().toISOString(),
      });

      return { totalAmount: fullCodAmount };
    });

    try {
      await updateDoc(doc(db, "users", userId), { cart: [] });
    } catch (error) {
      console.warn("Could not clear cart after Full COD conversion:", error);
    }

    return NextResponse.json({ success: true, data: { orderId, ...result } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not switch this order to Full COD";
    const status = message.includes("not authorized") ? 403 : message.includes("already") || message.includes("only after") || message.includes("not available") ? 409 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
