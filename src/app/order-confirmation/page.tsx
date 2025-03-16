"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-50 to-white">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
                <h1 className="text-4xl font-bold text-green-600 mb-4">
                    🎉 Order Confirmed!
                </h1>
                {orderId ? (
                    <>
                        <p className="text-lg text-gray-700 mb-6">
                            Your Shiprocket Order ID is:
                        </p>
                        <p className="text-2xl font-mono text-green-800 bg-green-100 p-4 rounded-lg">
                            {orderId}
                        </p>
                    </>
                ) : (
                    <p className="text-red-500">
                        Error: No Order ID Found. Please contact support.
                    </p>
                )}
                <Link href="/orders" className="mt-8 inline-block bg-green-500 text-white px-6 py-3 rounded-md shadow hover:bg-green-600 transition">
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
