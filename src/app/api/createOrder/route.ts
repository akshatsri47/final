import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";




export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    const orderId = String((await cookies()).get('orderId')?.value);

    const res = await axios.post('http://localhost:3000/api/phone-pe',{
      amount,
      merchantOrderId:orderId

    })
    const {redirectUrl} = res.data
    // const orderRef = doc(db,"orders",orderId);
    // await updateDoc(orderRef,{status:"Payment Completed Ready to Ship"});
    return NextResponse.json({success:true,redirectUrl:redirectUrl});
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
