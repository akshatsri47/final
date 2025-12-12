import { NextRequest, NextResponse } from 'next/server';
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from 'pg-sdk-node';


const clientId = process.env.PHONE_PE_CLIENT_ID || "";
const clientSecret = process.env.PHONE_PE_CLIENT_SECRET || "";
const clientVersion = Number(process.env.PHONE_PE_CLIENT_VERSION)|| 1;
const env = process.env.PHONE_PE_ENVIRONMENT === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX;

const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

export async function POST(req: NextRequest) {
  try {
    console.log('PhonePe Environment Variables:', {
      clientId: clientId ? 'SET' : 'MISSING',
      clientSecret: clientSecret ? 'SET' : 'MISSING',
      clientVersion,
      env: env === Env.PRODUCTION ? 'PRODUCTION' : 'SANDBOX',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    });

    const { amount, merchantOrderId } = await req.json();
    console.log('PhonePe payment request:', { amount, merchantOrderId });

    if (!amount || !merchantOrderId) {
      return NextResponse.json(
        { success: false, error: 'Amount and merchantOrderId are required' },
        { status: 400 }
      );
    }

    if (!clientId || !clientSecret) {
      console.error('PhonePe credentials missing');
      return NextResponse.json(
        { success: false, error: 'PhonePe credentials not configured' },
        { status: 500 }
      );
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation?orderId=${merchantOrderId}`;
    console.log('Redirect URL:', redirectUrl);

    console.log('Creating PhonePe payment request...');
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(Number(amount))
      .redirectUrl(redirectUrl)
      .build();

    console.log('Calling PhonePe API...');
    const response = await client.pay(request);
    console.log('PhonePe API Response:', response);
    
    const checkoutPageUrl = response.redirectUrl;

    return NextResponse.json({ success: true, redirectUrl: checkoutPageUrl });
  } catch (e) {
    console.error("Payment error details:", {
      message: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
      error: e
    });
    return NextResponse.json(
      { success: false, error: `Payment initialization failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 }
    );
  }
}


