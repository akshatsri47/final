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
    const [canUseFullCod, setCanUseFullCod] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);
    const [isConvertingToCod, setIsConvertingToCod] = useState(false);
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
                        setCanUseFullCod(
                            orderRes.data.data.fullCodAllowed === true &&
                            orderRes.data.data.allowedPaymentMethods?.includes("FULL_COD")
                        );
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

                const { success: paymentSuccess, paymentState } = res.data;
                if (paymentSuccess) {
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
                    // Confirmation is shown only after payment verification and shipment creation.
                    setSuccess(true);
                } else if (paymentState === "FAILED") {
                    setPaymentFailed(true);
                    // Only PhonePe's terminal FAILED state is recorded as a failure.
                    try {
                        await updateOrderStatus(orderId, "Payment Failed", userId);
                    } catch (statusError) {
                        console.warn("Failed to update order status:", statusError);
                    }
                    setError("The online payment failed. You can retry later or place this same order using Full COD below.");
                } else if (paymentState === "PENDING") {
                    setError("Your payment is still pending with PhonePe. Please wait a few minutes and refresh this page.");
                } else {
                    setError(res.data?.msg || "Payment could not be verified. Please contact support.");
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

    const convertToFullCod = async () => {
        if (!orderId || isConvertingToCod) return;
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("Please log in again to place this order using COD.");
            return;
        }

        setIsConvertingToCod(true);
        try {
            const conversion = await axios.post("/api/order/full-cod", { orderId, userId });
            const dueAmount = Number(conversion.data?.data?.totalAmount) || 0;
            const shipId = await createShiprocketOrder(userId, "FULL_COD", orderId);
            await updateOrderStatus(orderId, "Full COD Confirmed - Ready to Ship", userId);
            setShipRocketId(shipId);
            setCodAdvanceAmount(0);
            setCodDueAmount(dueAmount);
            setIsCodOrder(true);
            setCanUseFullCod(false);
            setError("");
            setSuccess(true);
        } catch (err) {
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            setError(message || "Could not switch this order to Full COD. Please try again.");
        } finally {
            setIsConvertingToCod(false);
        }
    };

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
                    <>
                        <p className="text-red-500">{error}</p>
                        {paymentFailed && canUseFullCod && (
                            <button
                                type="button"
                                onClick={convertToFullCod}
                                disabled={isConvertingToCod}
                                className="mt-6 w-full rounded-md bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-wait disabled:bg-gray-400"
                            >
                                {isConvertingToCod ? "Confirming COD Order..." : "Place This Order with Full COD"}
                            </button>
                        )}
                    </>
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
