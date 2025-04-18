import { db } from "../../../../utils/firebase";
import { doc, updateDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { NextResponse } from "next/server";
import crypto from "crypto";

const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY as string;
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX as string;

// Helper function to verify PhonePe callback signature
function verifyPhonePeCallback(payload: string, xVerify: string): boolean {
  const [checksum, saltIndex] = xVerify.split('###');
  
  if (saltIndex !== PHONEPE_SALT_INDEX) {
    return false;
  }
  
  const string = payload + PHONEPE_SALT_KEY;
  const calculatedChecksum = crypto.createHash('sha256').update(string).digest('hex');
  
  return calculatedChecksum === checksum;
}

export async function POST(req: Request) {
  try {
    // Get the X-VERIFY header and request body
    const xVerify = req.headers.get('X-VERIFY');
    const payload = await req.text();
    
    if (!xVerify) {
      return NextResponse.json({ error: "Missing X-VERIFY header" }, { status: 400 });
    }
    
    // Verify the callback
    if (!verifyPhonePeCallback(payload, xVerify)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    
    const response = JSON.parse(payload);
    
    // Extract data from the callback
    const { merchantTransactionId, transactionStatus, code } = response.data;
    
    if (!merchantTransactionId) {
      return NextResponse.json({ error: "Missing merchantTransactionId" }, { status: 400 });
    }
    
    // Find order by merchantTransactionId using v9 syntax
    const ordersCollection = collection(db, "orders");
    const orderQuery = query(
      ordersCollection, 
      where("merchantTransactionId", "==", merchantTransactionId),
      limit(1)
    );
    const ordersSnapshot = await getDocs(orderQuery);
    
    if (ordersSnapshot.empty) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    const orderDoc = ordersSnapshot.docs[0];
    const orderId = orderDoc.id;
    
    // Update order status based on PhonePe response
    let newStatus;
    if (transactionStatus === "SUCCESS" || code === "PAYMENT_SUCCESS") {
      newStatus = "Payment Completed Ready to Ship";
    } else if (transactionStatus === "PENDING") {
      newStatus = "Payment Pending";
    } else {
      newStatus = "Payment Failed";
    }
    
    // Update the order
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { 
      status: newStatus,
      paymentResponse: response
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing PhonePe callback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}