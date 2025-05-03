import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


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

    const userId = String(req.headers.get("userId"));

    if (!userId) {
      return NextResponse.json(
        { success: false, msg: "Missing user ID in headers" },
        { status: 400 }
      );
    }

    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/phone-pe/check-status`, {
      merchantOrderId,
    });

    const { paymentState } = res.data;

    if (paymentState === "COMPLETED") {
      
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
    if(paymentState==="PENDING"){
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
