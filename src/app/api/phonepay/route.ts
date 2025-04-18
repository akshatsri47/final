import { db } from "../../../../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

// PhonePe configuration
const PHONEPE_HOST = process.env.NODE_ENV === "production" 
  ? "https://api.phonepe.com/apis/hermes"
  : "https://api-preprod.phonepe.com/apis/pg-sandbox";
const PHONEPE_ENDPOINT = "/pg/v1/pay";
const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID as string;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY as string;
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX as string;

// Helper function to generate PhonePe X-VERIFY header
function generatePhonePeChecksum(payload: string): string {
  const string = payload + PHONEPE_ENDPOINT + PHONEPE_SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  return `${sha256}###${PHONEPE_SALT_INDEX}`;
}

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    
    const orderId = String((await cookies()).get('orderId')?.value);
    const merchantTransactionId = `MT${Date.now()}`;
    
    // Create PhonePe payment request payload
    const payloadObj = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: `MUID_${orderId}`,
      amount: 1000, // Amount in paise
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      redirectMode: "REDIRECT",
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/verifyphonepay`, // Using your existing verify endpoint
      mobileNumber: "", // Optional, can be provided by the client if available
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };
    
    // Convert payload to base64
    const payloadBase64 = Buffer.from(JSON.stringify(payloadObj)).toString('base64');
    
    // Generate X-VERIFY header
    const xVerify = generatePhonePeChecksum(payloadBase64);
    
    // Make API call to PhonePe
    const response = await fetch(`${PHONEPE_HOST}${PHONEPE_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify
      },
      body: JSON.stringify({ request: payloadBase64 })
    });
    
    const phonepeResponse = await response.json();
    
    if (!phonepeResponse.success) {
      return NextResponse.json({ 
        error: phonepeResponse.message || "PhonePe payment initiation failed" 
      }, { status: 400 });
    }
    
    // Update order in database with the transaction ID for later verification
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { 
      status: "Payment Initiated",
      merchantTransactionId: merchantTransactionId
    });
    
    // Return the payment information
    return NextResponse.json({
      success: true,
      merchantTransactionId: merchantTransactionId,
      redirectUrl: phonepeResponse.data.instrumentResponse.redirectInfo.url,
      method: phonepeResponse.data.instrumentResponse.redirectInfo.method
    });
    
  } catch (error) {
    console.error("Error creating PhonePe order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}