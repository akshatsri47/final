"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { createShiprocketOrder, updateOrderStatus } from "@/components/Orderservice";

export const dynamic = "force-dynamic";

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [success, setSuccess] = useState(false);
    const [shipRocketId, setShipRocketId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        

        const verifyAndCreateOrder = async () => {
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
                // Step 1: Verify Payment
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verifyOrder/${orderId}`, {
                    headers: { userId },
                });

                const { success } = res.data;
                if (success) {
                    setSuccess(true);

                    
                    const shipId = await createShiprocketOrder(userId, "ONLINE");
                    await updateOrderStatus(orderId,"Ready To Ship !")
                    setShipRocketId(shipId);
                } else {
                    await updateOrderStatus(orderId,"Failed Payment !")
                    setError("Order verification failed. Please contact support.");
                }
            } catch (err) {
                console.error(err);
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        verifyAndCreateOrder();
    }, [orderId]);

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
                ) : (
                    <>
                        <p className="text-lg text-gray-700 mb-6">
                            Your Shiprocket Order ID is:
                        </p>
                        <p className="text-2xl font-mono text-green-800 bg-green-100 p-4 rounded-lg">
                            {shipRocketId}
                        </p>
                    </>
                )}
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
