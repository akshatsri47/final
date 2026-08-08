import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { db } from "../../../../../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";


export async function GET(req: NextRequest) {
  try {
    const pathname = req.nextUrl.pathname;
    const parts = pathname.split("/");
    const merchantOrderId = parts[parts.length - 1];

    if (!merchantOrderId) {
      return NextResponse.json(
        { success: false, msg: "Order ID not found in URL" },
        { status: 400 }
      );
    }

    const userId = req.headers.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, msg: "Missing user ID in headers" },
        { status: 400 }
      );
    }

    // ✅ Fetch the order — needed for ownership check + expected amount
    const orderRef = doc(db, "orders", merchantOrderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return NextResponse.json(
        { success: false, msg: "Order not found" },
        { status: 404 }
      );
    }

    const orderData = orderSnap.data();

    if (orderData.userId !== userId) {
      return NextResponse.json(
        { success: false, msg: "Not authorized to verify this order" },
        { status: 403 }
      );
    }

    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/phone-pe/check-status`, {
      merchantOrderId,
    });

    const { paymentState, amount } = res.data;

    if (paymentState === "COMPLETED") {
      // ✅ Verify the PAID AMOUNT matches the order's expected amount
      //    (COD → 15% advance, ONLINE → full total). State alone is not enough.
      const expectedAmount =
        orderData.paymentMethod === "COD"
          ? Number(orderData.codAdvanceAmount) || 0
          : Number(orderData.totalAmount) || 0;
      const expectedPaise = Math.round(expectedAmount * 100);
      const paidPaise = typeof amount === "number" ? Math.round(amount) : NaN;

      if (!Number.isFinite(paidPaise) || paidPaise !== expectedPaise) {
        console.error(
          `Payment amount mismatch for order ${merchantOrderId}: paid=${paidPaise} paise, expected=${expectedPaise} paise`
        );
        return NextResponse.json(
          {
            success: false,
            orderId: merchantOrderId,
            msg: "Payment amount mismatch. Please contact support.",
          },
          { status: 200 }
        );
      }

      // ✅ Mark the order as paid (auditable) and clear the cart so the same
      //    items can't be ordered twice. Bookkeeping failures must not fail the
      //    verification response — the payment itself is already confirmed.
      try {
        await updateDoc(orderRef, { paymentVerified: true, paidAmount: paidPaise / 100 });
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { cart: [] });
      } catch (writeError) {
        console.error("Post-verification bookkeeping failed:", writeError);
      }

      return NextResponse.json(
        {
          success: true,
          orderId: merchantOrderId,
          msg: "Payment successful",
        },
        { status: 200 }
      );
    }

    if (paymentState === "FAILED") {
      return NextResponse.json(
        {
          success: false,
          orderId: merchantOrderId,
          msg: "Payment failed - PhonePe returned FAILED",
        },
        { status: 200 }
      );
    }
    if (paymentState === "PENDING") {
      return NextResponse.json(
        {
          success: false,
          orderId: merchantOrderId,
          msg: "Payment is Pending",
        },
        { status: 200 }
      );
    }

    // For other unexpected payment states
    return NextResponse.json(
      {
        success: false,
        msg: `Unexpected payment state: ${paymentState}`,
        orderId: merchantOrderId,
      },
      { status: 400 }
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, msg: "Internal server error", error: `${e}` },
      { status: 500 }
    );
  }
}
