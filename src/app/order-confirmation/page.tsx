"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import axios from "axios";
import { createShiprocketOrder, updateOrderStatus } from "@/components/Orderservice";

export const dynamic = "force-dynamic";

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const paymentMethod = searchParams.get("paymentMethod"); // fallback only — COD orders now return from PhonePe without this param

    const [success, setSuccess] = useState(false);
    const [shipRocketId, setShipRocketId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isCodOrder, setIsCodOrder] = useState(false);
    const [codAdvanceAmount, setCodAdvanceAmount] = useState(0);
    const [codDueAmount, setCodDueAmount] = useState(0);
    // Guard against double execution (React StrictMode / effect re-runs) —
    // verification + Shiprocket creation must run only once per page load.
    const hasRunRef = useRef(false);

    useEffect(() => {
        const handleOrderConfirmation = async () => {
            if (hasRunRef.current) return;
            hasRunRef.current = true;

            if (!orderId) {
                setError("No Order ID Found. Please contact support.");
                setLoading(false);
                return;
            }

            const userId = localStorage.getItem("userId");
            if (!userId) {
                setError("User not logged in. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                console.log("Processing order confirmation:", { orderId, paymentMethod });

                // Fetch the order to learn how it was paid (PhonePe's redirect URL does not
                // carry the payment method) plus the COD advance / on-delivery split amounts
                let orderPaymentMethod: string | null = paymentMethod;
                try {
                    const orderRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/order?orderId=${orderId}&userId=${encodeURIComponent(userId)}`);
                    if (orderRes.data?.success && orderRes.data?.data) {
                        orderPaymentMethod = orderRes.data.data.paymentMethod ?? orderPaymentMethod;
                        setCodAdvanceAmount(orderRes.data.data.codAdvanceAmount ?? 0);
                        setCodDueAmount(orderRes.data.data.codDueAmount ?? 0);
                    }
                } catch (fetchError) {
                    console.warn("Could not fetch order details, falling back to URL params:", fetchError);
                }

                const isCod = orderPaymentMethod === "COD";
                setIsCodOrder(isCod);

                // Verify the online payment — for COD orders this is the 15% advance
                console.log("Verifying payment for order:", orderId);
                
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verifyOrder/${orderId}`, {
                    headers: { userId },
                });

                console.log("Payment verification response:", res.data);

                const { success: paymentSuccess } = res.data;
                if (paymentSuccess) {
                    setSuccess(true);
                    
                    const shipId = await createShiprocketOrder(userId, isCod ? "COD" : "ONLINE", orderId);
                    setShipRocketId(shipId);

                    // Update order status for successful payment
                    try {
                        await updateOrderStatus(
                            orderId,
                            isCod ? "COD Advance Paid - Ready to Ship" : "Payment Verified - Ready to Ship!",
                            userId
                        );
                    } catch (statusError) {
                        console.warn("Failed to update order status:", statusError);
                        // Don't fail the whole process if status update fails
                    }
                } else {
                    // Update order status for failed payment
                    try {
                        await updateOrderStatus(orderId, "Payment Failed", userId);
                    } catch (statusError) {
                        console.warn("Failed to update order status:", statusError);
                    }
                    setError("Payment verification failed. Please contact support.");
                }
            } catch (err) {
                console.error("Order confirmation error:", err);
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        handleOrderConfirmation();
    }, [orderId, paymentMethod]);

    if (loading) {
        return <p className="text-center py-10">Loading...</p>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-50 to-white">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
                {success?(<h1 className="text-4xl font-bold text-green-600 mb-4">
                    🎉 Order Confirmed!
                </h1>):<h1 className="text-4xl font-bold text-green-600 mb-4">
                    Order Not Confirmed !
                </h1>}
                {error && !success ? (
                    <p className="text-red-500">{error}</p>
                ) : success ? (
                    <>
                        {isCodOrder ? (
                            <>
                                <p className="text-lg text-gray-700 mb-4">
                                    Your COD order has been confirmed!
                                </p>
                                <p className="text-sm text-gray-600 mb-6">
                                    {codAdvanceAmount > 0 ? `₹${codAdvanceAmount} paid online. ` : ""}
                                    {codDueAmount > 0
                                        ? `Please keep ₹${codDueAmount} ready — it will be collected when your order is delivered.`
                                        : "The remaining amount will be collected upon delivery."}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-lg text-gray-700 mb-4">
                                    Payment successful! Your order is confirmed.
                                </p>
                            </>
                        )}
                        <p className="text-lg text-gray-700 mb-6">
                            Your Order ID is:
                        </p>
                        <p className="text-2xl font-mono text-green-800 bg-green-100 p-4 rounded-lg">
                            {shipRocketId}
                        </p>
                    </>
                ) : null}
                <Link
                    href="/orders"
                    className="mt-8 inline-block bg-green-500 text-white px-6 py-3 rounded-md shadow hover:bg-green-600 transition"
                >
                    View Your Orders
                </Link>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<p className="text-center py-10">Loading...</p>}>
            <OrderConfirmationContent />
        </Suspense>
    );
}
