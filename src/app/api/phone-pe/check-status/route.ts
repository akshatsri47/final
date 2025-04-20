import { NextRequest, NextResponse } from 'next/server';
import { StandardCheckoutClient, Env } from 'pg-sdk-node';

const clientId = process.env.PHONE_PE_CLIENT_ID || "";
const clientSecret = process.env.PHONE_PE_CLIENT_SECRET || "";
const clientVersion = Number(process.env.PHONE_PE_CLIENT_VERSION);
const env = Env.SANDBOX;

const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

export async function POST(req: NextRequest) {
    try {
      const {merchantOrderId} = await req.json(); 
  
      if (!merchantOrderId) {
        return NextResponse.json({ msg: "Merchant Order Id required" }, { status: 400 });
      }
  
      const response = await client.getOrderStatus(merchantOrderId);
      console.log(response.state);
  
      return NextResponse.json({
        merchantOrderId,
        paymentState: response.state,
      });
    } catch (e) {
      console.error("Status check error:", e);
      return NextResponse.json(
        { success: false, error: String(e) + " Error fetching order status" },
        { status: 500 }
      );
    }
  }
  