"use client";
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../utils/api";
// import { CartItem } from '../../../types/types';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  packageSize: string; // Add this line
  image?: string | string[];
  images?: string[];
  addedAt?: string;
}


export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  const isFetchingRef = useRef(false);
  const quantityChanges = useRef<Record<string, number>>({});
  const latestCartRef = useRef<CartItem[]>([]);

  // Retrieve userId safely to avoid SSR issues
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId") || "";
      setUserId(storedUserId);
    }
  }, []);

  // Fetch cart items from the backend
  const fetchCartItems = useCallback(async () => {
    if (!userId || isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await api.get(`/cart?userId=${userId}`);
      setCart(res.data.cart);
      latestCartRef.current = res.data.cart;
    } catch (err) {
      setError("Failed to load cart");
      console.log(err)
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [userId]);

  // Periodically send any quantity changes to the backend
  const sendQuantityUpdates = useCallback(async () => {
    if (!userId || Object.keys(quantityChanges.current).length === 0) return;
    try {
      await Promise.all(
        latestCartRef.current.map(({ productId, packageSize, quantity }) =>
            api.put("/cart", { userId, productId, quantity, packageSize })
        )
    );
      
      quantityChanges.current = {};
    } catch (err) {
      console.error(err);
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

  // Update the cart item quantity locally and track the changes
  const modifyCartQuantity = (productId: string, change: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) } // Ensure quantity stays at least 1
          : item
      )
    );
  
    const updatedCart = latestCartRef.current.map(item =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, item.quantity + change) } // Ensure quantity stays at least 1
        : item
    );
  
    latestCartRef.current = updatedCart;
    quantityChanges.current[productId] =
      updatedCart.find(it => it.productId === productId)?.quantity || 1;
  };
  
  

  // Remove an item from the cart
  const removeCartItem = async (productId: string, packageSize: string) => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.productId === productId && item.packageSize === packageSize))
    );
    latestCartRef.current = latestCartRef.current.filter(
      item => !(item.productId === productId && item.packageSize === packageSize)
    );
    delete quantityChanges.current[`${productId}-${packageSize}`];
  
    try {
      await api.delete(`/cart?userId=${userId}&productId=${productId}&packageSize=${packageSize}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Place the order and navigate to the address page on success
  const placeOrder = async () => {
    if (!userId) return alert("User ID not found!");
    if (cart.length === 0) return alert("Cart is empty!");
    try {
      setOrderStatus("Placing order...");
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Order placement failed");
      setOrderStatus("🎉 Order Confirmed!");
      setCart([]);
      latestCartRef.current = [];
      router.push("/address");
    } catch (err) {
      setOrderStatus(
        `Error: ${err instanceof Error ? err.message : "Order placement failed."}`
      );
    }
  };

  if (loading) {
    return <p className="text-center text-lg py-36">⏳ Loading cart...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">❌ {error}</p>;
  }
  if (!cart.length) {
    return (
      <p className="text-center text-gray-500 text-2xl my-10">
        🛒 No items found in your cart.
      </p>
    );
  }

  const itemCount = cart.length;
  const itemsTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <section className="relative z-10 after:content-[''] after:absolute after:z-0 after:h-full xl:after:w-1/3 after:top-0 after:right-0 after:bg-gray-50">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:6 mx-auto relative z-10">
        <div className="grid grid-cols-12">
          {/* Left Column: Cart Items */}
          <div className="col-span-12 xl:col-span-8 lg:pr-8 pt-14 pb-8 lg:py-24 w-full max-xl:max-w-3xl max-xl:mx-auto">
            <h2 className="font-manrope font-bold text-3xl leading-10 text-black mb-8">
              Your Cart
            </h2>
            {cart.map(item => {
              // Determine the image URL: check for a string or an array
              const imageUrl =
                (Array.isArray(item.image)
                  ? item.image[0]
                  : item.image) ||
                (Array.isArray(item.images)
                  ? item.images[0]
                  : item.images) ||
                "/images.png";
              return (
                <div
                  key={uuidv4()}
                  className="flex items-center justify-between p-4 border rounded-lg shadow-md mb-4"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover rounded"
                    />
                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-gray-700">Price: ₹{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => modifyCartQuantity(item.productId, -1)}
                        className="px-3 py-2 bg-gray-300 rounded text-black"
                      >
                        ➖
                      </button>
                      <span className="text-lg font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => modifyCartQuantity(item.productId, 1)}
                        className="px-3 py-2 bg-gray-300 rounded text-black"
                      >
                        ➕
                      </button>
                    </div>
                    <button
                      onClick={() => removeCartItem(item.productId,item.packageSize)}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Right Column: Order Summary */}
          <div className="col-span-12 xl:col-span-4 bg-gray-50 w-full max-xl:px-6 max-w-3xl xl:max-w-lg mx-auto lg:pl-8 py-24">
            <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-8 border-b border-gray-300">
              Order Summary
            </h2>
            <div className="mt-8">
              {/* Promo Code Section */}
              <div className="mb-6">
                <label className="block mb-2 text-gray-400 text-sm font-medium">
                  Promo Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="block w-full h-11 pr-4 pl-5 py-2 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-l-lg placeholder-gray-500 focus:outline-gray-400"
                    placeholder="xxxx xxxx xxxx"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-black text-white rounded-r-lg text-sm font-semibold transition-all duration-500 hover:bg-black/80"
                  >
                    Apply
                  </button>
                </div>
              </div>
              {/* Final Totals and Order Now button on one line */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-8">
                <div>
                  <p className="font-medium text-xl text-black">
                    {itemCount} Items
                  </p>
                  <p className="font-semibold text-xl text-indigo-600">
                  ₹{itemsTotal.toFixed(2)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={placeOrder}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold"
                >
                  🛒 Order Now
                </button>
              </div>
              {orderStatus && (
                <p className="mt-6 text-lg text-blue-600 font-semibold text-center">
                  {orderStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}