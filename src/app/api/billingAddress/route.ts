import { NextResponse } from "next/server";
import { db } from "../../../../utils/firebase"; // Ensure Firebase is initialized correctly
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Address, User } from "../../../../types/types"; // Assuming you have these types defined

export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const { userId, address }: { userId: string; address: Address } = await req.json();
    if (!userId || !address) {
      return NextResponse.json({ error: "Missing userId or address" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data() as User;
    const addresses: Address[] = userData.address || [];

    // Check if address already exists
    const exists = addresses.some(
      (addr) =>
        addr.name === address.name &&
        addr.line1 === address.line1 &&
        addr.city === address.city &&
        addr.state === address.state &&
        addr.zip === address.zip
    );

    if (!exists) {
      addresses.push(address);
      await updateDoc(userRef, { address: addresses });
    }

    return NextResponse.json({ message: "Address added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
