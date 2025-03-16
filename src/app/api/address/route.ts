import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../utils/firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface Address {
    name:string,
    line1: string;
    line2?: string;
    state: string;
    city: string;
    zip: string;
    phone: string;
}

// Helper function to check for missing fields
function findMissingFields(address: Partial<Address>): string[] {
    const requiredFields: (keyof Address)[] = ["line1", "state", "city", "zip", "phone"];
    return requiredFields.filter(field => !address[field]);
}

// ✅ **PUT Route: Update or Replace the Address**
export async function PUT(req: Request): Promise<NextResponse> {
    try {
        const { userId, address }: { userId: string; address: Address } = await req.json();

        if (!userId || !address) {
            return NextResponse.json({ error: "Missing userId or address" }, { status: 400 });
        }

        // Check for missing fields
        const missingFields = findMissingFields(address);
        if (missingFields.length > 0) {
            return NextResponse.json({ error: `Missing address fields: ${missingFields.join(", ")}` }, { status: 400 });
        }

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Replace the existing address (only one address per user)
        await updateDoc(userRef, { address });

        return NextResponse.json({ message: "Address updated successfully", data: address }, { status: 200 });
    } catch (error) {
        console.error("Error updating address:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ **GET Route: Fetch the Single Address**
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    const address: Address | null = userData?.address || null;

    if (!address) {
        return NextResponse.json({ success: false, msg: "No address found for this user" }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: address, msg: "Address found!" }, { status: 200 });
}
