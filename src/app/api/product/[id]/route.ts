import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../utils/firebase";
import { collection, doc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { slugifyProductName } from "@/lib/productUrl";

async function findProduct(identifier: string) {
  if (!identifier.includes("/")) {
    const directRef = doc(db, "products", identifier);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) return directSnap;
  }

  const productsSnap = await getDocs(collection(db, "products"));
  return productsSnap.docs.find((productDoc) => {
    const data = productDoc.data();
    return data.slug === identifier || slugifyProductName(data.name || "") === identifier;
  }) || null;
}

export async function GET(request: NextRequest) {
  try {
    const  id  = request.url.split('/').pop();

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const productSnap = await findProduct(decodeURIComponent(id));

    if (!productSnap) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { id: productSnap.id, ...productSnap.data() },
      message: "Successfully fetched product",
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, error: "Error fetching product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    
    const  id  = req.url.split('/').pop()

    if (!id) return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });

    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    await deleteDoc(productRef);

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Error deleting product"+e }, { status: 500 });
  }
}
