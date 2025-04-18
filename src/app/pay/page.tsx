'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentProps {
  amount: number; // amount in paise (e.g., ₹100 = 10000 paise)
  orderId: string;
}

const PaymentGateway: React.FC<PaymentProps> = ({ amount, orderId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to handle PhonePe payment
  const handlePhonePePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      amount = 1000
      
      // Call your existing PhonePe API endpoint
      const response = await fetch('/api/phonepay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment order');
      }
      
      // Redirect to PhonePe payment page
      window.location.href = data.redirectUrl;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-options max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Payment Method</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        <button
          onClick={handlePhonePePayment}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay with PhonePe'}
        </button>
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        You will be redirected to the payment gateway to complete your payment securely.
      </p>
    </div>
  );
};

export default PaymentGateway;