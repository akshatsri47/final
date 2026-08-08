"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shiprocketTrackingId?: string;
  paymentMethod?: "ONLINE" | "COD";
  codAdvanceAmount?: number; // COD: 15% paid online at checkout
  codDueAmount?: number;     // COD: 85% due on delivery
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const userId = localStorage.getItem("userId") || "";
      const response = await fetch(`/api/order?orderId=${id}&userId=${encodeURIComponent(userId)}`);
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshTrackingId = async () => {
    try {
      const response = await fetch(`/api/ship/track?orderId=${id}`);
      const data = await response.json();
      if (data.success) {
        setOrder((prev) => prev ? { ...prev, shiprocketTrackingId: data.trackingId } : null);
      }
    } catch (error) {
      console.error("Error fetching tracking ID:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading order details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Details</h1>
        <p className="text-gray-600">Order ID: {order?.id}</p>
        <p className="text-gray-600">Total Amount: <span className="font-bold">₹{order?.totalAmount}</span></p>
        {order?.paymentMethod === "COD" && (order?.codDueAmount ?? 0) > 0 && (
          <p className="text-gray-600">
            Paid online: <span className="font-bold text-green-700">₹{order?.codAdvanceAmount}</span>
            {" · "}Due on delivery: <span className="font-bold">₹{order?.codDueAmount}</span>
          </p>
        )}
        <p className="text-gray-600">Status: <span className="font-bold">{order?.status}</span></p>
        <p className="text-gray-600">Placed on: {new Date(order?.createdAt || "").toLocaleString()}</p>

        {order?.shiprocketTrackingId ? (
          <p className="text-green-600 font-bold mt-2">
            Tracking ID: {order.shiprocketTrackingId}
          </p>
        ) : (
          <p className="text-red-500">Tracking ID not available yet.</p>
        )}

        <button onClick={refreshTrackingId} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow">
          Refresh Tracking ID
        </button>
      </div>
    </div>
  );
}
