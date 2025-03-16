import { useEffect, useState, useRef, useCallback } from "react";
import api from "../utils/api";

 export interface CartItem {
  productId: string; // ID of the product in the cart
  quantity: number;  // Number of items added
  price: number;     // Price at the time of adding
  name: string; 
  image: string[]| string ;  // Product name (to avoid extra Firestore reads)
  images: string[];     // Main product image
  packageSize: string; // Selected package size
  addedAt: string;   // Timestamp when added to cart
}

export const useCart = (userId: string) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const quantityChanges = useRef<Record<string, number>>({});
  const latestCartRef = useRef<CartItem[]>([]);

  const fetchCartItems = useCallback(async () => {
    if (!userId || isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await api.get(`/cart?userId=${userId}`);
      console.log("🛒 Fetched Cart Data:", res.data);
      setCart(res.data.cart);
      latestCartRef.current = res.data.cart;
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      setError("Failed to load cart");
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [userId]);

  const modifyCartQuantity = (productId: string, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + change } : item
      )
    );

    const updatedCart = latestCartRef.current.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + change } : item
    );

    latestCartRef.current = updatedCart;
    quantityChanges.current[productId] = updatedCart.find((item) => item.productId === productId)?.quantity || 0;
  };

  const sendQuantityUpdates = useCallback(async () => {
    if (!userId || Object.keys(quantityChanges.current).length === 0) return;

    try {
      console.log("🔄 Sending only final quantity updates:", quantityChanges.current);
      await Promise.all(
        Object.entries(quantityChanges.current).map(([productId, quantity]) =>
          api.put("/cart", { userId, productId, quantity })
        )
      );
      console.log("✅ Quantity updates successful!");
      quantityChanges.current = {};
    } catch (error) {
      console.error("❌ Error updating cart quantities:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchCartItems();
    const interval = setInterval(() => {
      sendQuantityUpdates();
    }, 5000);
    return () => clearInterval(interval);
  }, [userId, fetchCartItems, sendQuantityUpdates]);

  const removeCartItem = async (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    latestCartRef.current = latestCartRef.current.filter((item) => item.productId !== productId);
    delete quantityChanges.current[productId];

    try {
      await api.delete(`/cart?userId=${userId}&productId=${productId}`);
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };

  return {
    cart,
    loading,
    error,
    modifyCartQuantity,
    removeCartItem,
    setOrderStatus,
    orderStatus,
    setCart,
    latestCartRef,
  };
};

