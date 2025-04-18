import { db } from "../../../../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, gateway } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (gateway !== "phonepe") {
      return NextResponse.json({ error: "Unsupported payment gateway" }, { status: 400 });
    }

    // Generate unique transaction/order ID if needed
    const cookiesData = await cookies();
    const orderId = String(cookiesData.get("orderId")?.value);
    if (!orderId) {
      return NextResponse.json({ error: "Order ID missing in cookies" }, { status: 400 });
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepay?orderId=${orderId}&amount=${amount}`;

    // Update status in Firebase if needed (optional until payment is verified)
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: "Initiated" });

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error("Error creating PhonePe order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
