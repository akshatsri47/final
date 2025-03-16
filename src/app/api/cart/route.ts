export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../utils/firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { CartItem } from '../../../../types/types';
import { User } from '../../../../types/types';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, productId, quantity, packageSize } = body;

    if (!userId || !productId || !quantity || !packageSize) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Fetch product details from Firestore
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const productData = productSnap.data();
    const selectedPackage = productData.pricing?.find((p: { packageSize: string }) => p.packageSize === packageSize);

    const updatedCartItem: CartItem = {
      productId,
      quantity: Number(quantity),
      price: selectedPackage?.price ?? 0,
      name: productData.name ?? "Unnamed Product",
      images: productData.images?.[0] ?? "/placeholder.png", // Changed from "image" to "images"
      packageSize: selectedPackage?.packageSize ?? "Default Size",
      addedAt: new Date().toISOString(),
    };

    const userData = userSnap.data();
    const cart = userData.cart || [];

    const existingItemIndex = cart.findIndex(
      (item: CartItem) => item.productId === productId && item.packageSize === packageSize
    );
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex] = updatedCartItem;
    } else {
      cart.push(updatedCartItem);
    }

    await updateDoc(userRef, { cart });

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ success: false, error: "Error updating cart" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    return NextResponse.json({ success: true, cart: userData.cart || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ success: false, error: "Error fetching cart" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");
    const packageSize = searchParams.get("packageSize");
    
    if (!userId || !productId) {
      return NextResponse.json({ success: false, error: "User ID and Product ID are required" }, { status: 400 });
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data() as User;
    const updatedCart = userData.cart.filter(item => !(item.productId === productId && item.packageSize === packageSize));

    await updateDoc(userRef, { cart: updatedCart });

    return NextResponse.json({ success: true, message: "Cart item removed successfully", data: updatedCart });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
