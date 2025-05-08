import { NextRequest, NextResponse } from 'next/server';
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from 'pg-sdk-node';


const clientId = process.env.PHONE_PE_CLIENT_ID || "";
const clientSecret = process.env.PHONE_PE_CLIENT_SECRET || "";
const clientVersion = Number(process.env.PHONE_PE_CLIENT_VERSION)|| 1;
const env = Env.PRODUCTION;

const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

export async function POST(req: NextRequest) {
  try {
    const {amount,merchantOrderId} = await req.json();
    console.log(amount,merchantOrderId)
    // const merchantOrderId = "M123";
    // const amount = 100;
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation?orderId=${merchantOrderId}`;

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .redirectUrl(redirectUrl)
      .build();

    const response = await client.pay(request);
    const checkoutPageUrl = response.redirectUrl;

    return NextResponse.json({ success: true, redirectUrl: checkoutPageUrl });
;
  } catch (e) {
    console.error("Payment error:", e);
    return NextResponse.json(
      { success: false, error: String(e) + " Internal Server Error" },
      { status: 500 }
    );
  }
}


