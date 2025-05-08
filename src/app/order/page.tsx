"use client";

import api from "../utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../hooks/useCart";
import { useUserId } from "../hooks/useId";

import { Address } from "../../../types/types";

import { AddressCard } from "../../components/Addresscard";
import { CartSummary, calculateCartTotal } from "../../components/Cartsummary";

import {
  PaymentMethodSelector,
  PaymentMethod,
} from "../../components/Payementmethod";
import {
  createShiprocketOrder,
  
  createPhonePeOrder,
} from "../../components/Orderservice";



// interface RazorpayResponse {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }

export default function ConfirmOrderPage() {
  const router = useRouter();
  const userId = useUserId();
  const { cart, loading, error } = useCart(userId);
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ONLINE");
  const [isProcessing, setIsProcessing] = useState(false);
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  if (!razorpayKey) {
    throw new Error(
      "Razorpay key is missing. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in environment variables."
    );
  }

  // Fetch user address from backend
  useEffect(() => {
    const fetchAddress = async () => {
      if (!userId) return;
      try {
        const res = await api.get<{ success: boolean; data: Address }>(
          `/address?userId=${userId}`
        );
        if (res.data.success) {
          setAddress(res.data.data);
        } else {
          alert("No address found. Please add an address before placing an order.");
          router.push("/address");
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };
    fetchAddress();
  }, [userId, router]);

  // Handle COD order
  const handleCODOrder = async () => {
    if (!userId || !address) return;
    setIsProcessing(true);

    try {
      const orderId = await createShiprocketOrder(userId, "COD");
      alert("Order placed successfully!");
      router.push(`/order-confirmation?orderId=${orderId}`);
    } catch (error) {
      console.error("Error processing COD order:", error);
      alert("Failed to process your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Online Payment
  const handleOnlinePayment = async () => {
    if (!userId || !address) return;
    setIsProcessing(true);

    const totalAmount = calculateCartTotal(cart);

    try {
      const redirectUrl = await createPhonePeOrder(totalAmount);
      if(!redirectUrl){
        throw new Error('Internal Error During Payment Initiation');
      }

      router.push(redirectUrl);

      // initializeRazorpayPayment(
      //   razorpayKey,
      //   orderId,
      //   totalAmount,
      //   address,
      //   async (response: RazorpayResponse) => {
      //     try {
      //       const isVerified = await verifyRazorpayPayment(response);
      //       if (isVerified) {
      //         const shiprocketOrderId = await createShiprocketOrder(
      //           userId,
      //           "ONLINE"
      //         );
      //         alert("Order placed successfully!");
      //         router.push(`/order-confirmation?orderId=${shiprocketOrderId}`);
      //       } else {
      //         alert("Payment verification failed.");
      //         setIsProcessing(false);
      //       }
      //     } catch (error) {
      //       console.error("Error handling payment verification:", error);
      //       alert("Error occurred while processing payment verification.");
      //       setIsProcessing(false);
      //     }
      //   }
      //);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error occurred while creating order.");
      setIsProcessing(false);
    }
  };

  // Decide which payment method to process
  const handlePlaceOrder = () => {
    if (paymentMethod === "COD") {
      handleCODOrder();
    } else {
      handleOnlinePayment();
    }
  };

  // Loading / error states
  if (loading) {
    return <p className="text-center text-lg py-10">Loading cart...</p>;
  }
  if (error) {
    return (
      <p className="text-center text-red-500 py-10">
        Error loading cart: {error}
      </p>
    );
  }
  if (!address) {
    return <p className="text-center text-lg py-10">Loading address...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-white py-12">
     

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Confirm Your Order
        </h1>

        {/* Three-column layout for Address, Payment, and Cart Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Address */}
          <div>
            <AddressCard address={address} />
          </div>

          {/* Middle Column: Payment Method */}
          <div>
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />
          </div>

          {/* Right Column: Cart Summary */}
          <div>
            <CartSummary cart={cart} />
          </div>
        </div>

        {/* Place Order Button (bottom-right) */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className={`${
              isProcessing ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } transition-colors text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg`}
          >
            {isProcessing
              ? "⏳ Processing..."
              : `✅ Place Order ${paymentMethod === "COD" ? "(COD)" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
