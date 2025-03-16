"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shiprocketTrackingId?: string;
  items: CartItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchOrders(storedUserId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (userId: string) => {
    try {
      const response = await fetch(`/api/order?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        console.error("Failed to fetch orders:", data.error);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };
  const sortedOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Orders</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : !userId ? (
        <p className="text-center text-red-600">User ID not found. Please log in.</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {sortedOrders.map((order) => (
            <div key={order.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Order ID: {order.id}</h2>
              <p className="text-gray-600">Total Amount: <span className="font-bold">₹{order.totalAmount}</span></p>
              <p className="text-gray-600">Status: <span className="font-bold">{order.status}</span></p>
              <p className="text-gray-600">Placed on: {new Date(order.createdAt).toLocaleString()}</p>

              {order.shiprocketTrackingId ? (
                <p className="text-green-600 font-bold mt-2">
                  Tracking ID: {order.shiprocketTrackingId}
                </p>
              ) : (
                <p className="text-red-500">Tracking ID not available yet.</p>
              )}

              <Link href={`/orders/${order.id}`} className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition">
                View Order Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
