import { NextResponse } from "next/server";
import { db } from "../../../../utils/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

export interface Coupon {
    code: string;          // Coupon code (e.g., "NEWYEAR")
    discount: number;      // Discount percentage (e.g., 15 for 15% off)
    createdAt: number;     // Timestamp in milliseconds (Date.now())
    expiresAt?: number;    // Optional expiry date in milliseconds
}

const COUPON_COLLECTION = "coupons"; // Firestore Collection Name

// ✅ GET request (Fetch Active Coupon from Firebase)
export async function GET() {
  try {
    const docRef = doc(db, COUPON_COLLECTION, "active");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ message: "No active coupon", discount: 0 }, { status: 200 });
    }

    return NextResponse.json(docSnap.data(), { status: 200 });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST request (Save Coupon to Firebase)
export async function POST(req: Request) {
  try {
    const { code, discount, expiresAt } = await req.json();

    if (!code || typeof discount !== "number" || discount > 20) {
      return NextResponse.json({ error: "Invalid coupon code or discount" }, { status: 400 });
    }

    const couponData: Coupon = {
      code,
      discount,
      createdAt: Date.now(),
      expiresAt: expiresAt ?? null, // Optional expiration
    };

    await setDoc(doc(db, COUPON_COLLECTION, "active"), couponData);

    return NextResponse.json({ message: "Coupon applied successfully", ...couponData }, { status: 200 });
  } catch (error) {
    console.error("Error saving coupon:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ DELETE request (Remove Coupon from Firebase)
export async function DELETE() {
  try {
    await deleteDoc(doc(db, COUPON_COLLECTION, "active"));
    return NextResponse.json({ message: "Coupon removed" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
