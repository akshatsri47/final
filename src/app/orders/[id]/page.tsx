"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createShiprocketOrder, updateOrderStatus } from "@/components/Orderservice";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shiprocketTrackingId?: string;
  paymentMethod?: "ONLINE" | "COD" | "FULL_COD";
  codAdvanceAmount?: number; // COD: 15% paid online at checkout
  codDueAmount?: number;     // COD: 85% due on delivery
  onlinePaymentDiscountPercent?: number;
  onlinePaymentDiscountAmount?: number;
  paymentVerified?: boolean;
  failedPaymentFullCodAllowed?: boolean;
  cancelledAt?: string;
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCodRecovery, setShowCodRecovery] = useState(false);
  const [isConvertingToCod, setIsConvertingToCod] = useState(false);
  const [conversionError, setConversionError] = useState("");

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
        setShowCodRecovery(
          data.data.status === "Payment Failed" &&
          data.data.failedPaymentFullCodAllowed === true &&
          !data.data.cancelledAt
        );
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertToFullCod = async () => {
    const userId = localStorage.getItem("userId") || "";
    const orderId = String(id || "");
    if (!userId || !orderId || isConvertingToCod) return;

    setIsConvertingToCod(true);
    setConversionError("");
    try {
      const response = await fetch("/api/order/full-cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, userId }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Unable to switch to Full COD");

      await createShiprocketOrder(userId, "FULL_COD", orderId);
      const statusUpdated = await updateOrderStatus(orderId, "Full COD Confirmed - Ready to Ship", userId);
      if (!statusUpdated) throw new Error("The COD order was created, but its status could not be refreshed.");

      setShowCodRecovery(false);
      await fetchOrderDetails();
    } catch (error) {
      setConversionError(error instanceof Error ? error.message : "Unable to switch to Full COD");
    } finally {
      setIsConvertingToCod(false);
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

  const cancelOrder = async () => {
    const userId = localStorage.getItem("userId") || "";
    if (!userId || !confirm("Cancel this order? Any verified online payment will be refunded to the original payment method.")) return;
    const response = await fetch("/api/order/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, userId }),
    });
    const data = await response.json();
    if (!data.success) return alert(data.error || "Unable to cancel order");
    await fetchOrderDetails();
    alert(data.refundState === "NOT_REQUIRED" ? "Order cancelled." : `Order cancelled. Refund status: ${data.refundState}`);
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
        {(order?.onlinePaymentDiscountAmount ?? 0) > 0 && (
          <p className="text-green-700">Full prepaid discount ({order?.onlinePaymentDiscountPercent}%): <span className="font-bold">−₹{order?.onlinePaymentDiscountAmount}</span></p>
        )}
        {order?.status === "Payment Failed" && order?.paymentMethod === "COD" ? (
          <p className="font-medium text-red-600">
            Online advance payment of ₹{order.codAdvanceAmount ?? 0} failed. No amount was paid.
          </p>
        ) : order?.paymentMethod === "COD" && order?.paymentVerified && (order?.codDueAmount ?? 0) > 0 ? (
          <p className="text-gray-600">
            Paid online: <span className="font-bold text-green-700">₹{order?.codAdvanceAmount}</span>
            {" · "}Due on delivery: <span className="font-bold">₹{order?.codDueAmount}</span>
          </p>
        ) : order?.paymentMethod === "FULL_COD" && (order?.codDueAmount ?? 0) > 0 ? (
          <p className="text-gray-600">Full amount due on delivery: <span className="font-bold">₹{order.codDueAmount}</span></p>
        ) : null}
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
        {!order?.cancelledAt && (
          <button onClick={cancelOrder} className="mt-4 ml-3 bg-red-600 text-white px-4 py-2 rounded shadow">
            Cancel Order
          </button>
        )}
        {order?.status === "Payment Failed" && order.failedPaymentFullCodAllowed && !order.cancelledAt && (
          <button onClick={() => setShowCodRecovery(true)} className="mt-4 ml-3 bg-green-600 text-white px-4 py-2 rounded shadow">
            Use Full COD
          </button>
        )}
      </div>

      {showCodRecovery && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div role="dialog" aria-modal="true" aria-labelledby="cod-recovery-title" className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 id="cod-recovery-title" className="text-2xl font-bold text-gray-900">Payment Failed</h2>
            <p className="mt-3 text-gray-600">
              No online payment was received. You can confirm this order with Full Cash on Delivery and pay ₹{order.totalAmount} when it arrives.
            </p>
            {conversionError && <p className="mt-3 text-sm font-medium text-red-600">{conversionError}</p>}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={convertToFullCod}
                disabled={isConvertingToCod}
                className="flex-1 rounded-md bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-wait disabled:bg-gray-400"
              >
                {isConvertingToCod ? "Confirming..." : "Confirm Full COD"}
              </button>
              <button
                type="button"
                onClick={() => setShowCodRecovery(false)}
                disabled={isConvertingToCod}
                className="rounded-md border border-gray-300 px-4 py-3 font-semibold text-gray-700"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
