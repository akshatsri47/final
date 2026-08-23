"use client";

import api from "../utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../hooks/useCart";
import { useUserId } from "../hooks/useId";

import { Address } from "../../../types/types";

import { AddressCard } from "../../components/Addresscard";
import { CartSummary, calculateCheckoutTotals } from "../../components/Cartsummary";

import {
  PaymentMethodSelector,
  PaymentMethod,
} from "../../components/Payementmethod";
import {
  createPhonePeOrder,
  createShiprocketOrder,
  updateOrderStatus,
} from "../../components/Orderservice";
import { useCoupon } from "../context/CouponContext";
import { COD_ADVANCE_PERCENT, FULL_PREPAID_DISCOUNT_PERCENT, resolveCartPaymentRules, roundCurrency } from "../../lib/paymentEligibility";



// interface RazorpayResponse {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }

export default function ConfirmOrderPage() {
  const router = useRouter();
  const userId = useUserId();
  const { cart, loading, error } = useCart(userId);
  const { coupon } = useCoupon();
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ONLINE");
  const [isProcessing, setIsProcessing] = useState(false);
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

  const { total: totalOrderValue } = calculateCheckoutTotals(cart, coupon?.discount || 0);
  const paymentRules = resolveCartPaymentRules(cart, totalOrderValue);
  useEffect(() => {
    if (!paymentRules.allowedMethods.includes(paymentMethod)) {
      setPaymentMethod(paymentRules.allowedMethods[0]);
    }
  }, [paymentRules.allowedMethods, paymentMethod]);

  // Totals: no COD surcharge — 15% is paid online now, the remaining 85% on delivery
  const codAdvanceAmount =
    paymentMethod === "COD" ? roundCurrency((totalOrderValue * COD_ADVANCE_PERCENT) / 100) : 0;

  // Handle COD order
  const handleCODOrder = async () => {
    if (!userId || !address) {
      alert("Please ensure you're logged in and have an address selected.");
      return;
    }

    // Safety guard — COD is not allowed when the cart contains COD-disabled products
    if (!paymentRules.allowedMethods.includes("COD")) {
      alert("Partial COD is not available for this cart.");
      return;
    }

    setIsProcessing(true);

    try {
      // First create the order in database (server verifies COD eligibility and
      // stores the 15% advance / 85% on-delivery split on the order)
      const orderResponse = await api.post('/order', { userId, paymentMethod: "COD" });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.error || 'Failed to create order');
      }

      const orderId = orderResponse.data.data.id;
      console.log("Order created for COD:", orderId);

      // Collect the 15% advance online via PhonePe — the remaining 85% is paid on delivery.
      // The exact advance amount is computed server-side from the order document.
      // Shiprocket + status updates happen on the confirmation page after payment verification.
      const redirectUrl = await createPhonePeOrder(orderId, userId);
      if (!redirectUrl) {
        throw new Error('Internal Error During Payment Initiation');
      }

      console.log("Redirecting to PhonePe for COD advance payment:", redirectUrl);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error processing COD order:", error);
      const serverMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      alert(`Failed to process your order: ${serverMessage || (error instanceof Error ? error.message : 'Unknown error')}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFullCODOrder = async () => {
    if (!userId || !address || !paymentRules.allowedMethods.includes("FULL_COD")) return;
    setIsProcessing(true);
    try {
      const orderResponse = await api.post('/order', { userId, paymentMethod: "FULL_COD" });
      if (!orderResponse.data.success) throw new Error(orderResponse.data.error || 'Failed to create order');
      const orderId = orderResponse.data.data.id;
      await createShiprocketOrder(userId, "FULL_COD", orderId);
      await updateOrderStatus(orderId, "Full COD Confirmed - Ready to Ship", userId);
      router.push(`/orders/${orderId}`);
    } catch (error) {
      const message = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      alert(message || (error instanceof Error ? error.message : "Failed to place order"));
    } finally { setIsProcessing(false); }
  };

  // Handle Online Payment
  const handleOnlinePayment = async () => {
    if (!userId || !address) {
      alert("Please ensure you're logged in and have an address selected.");
      return;
    }

    setIsProcessing(true);

    try {
      // First create the order in database
      const orderResponse = await api.post('/order', { userId });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.error || 'Failed to create order');
      }

      const orderId = orderResponse.data.data.id;
      console.log("Order created for online payment:", orderId);

      // Then create payment — the charged amount is taken server-side from the order document
      const redirectUrl = await createPhonePeOrder(orderId, userId);
      if (!redirectUrl) {
        throw new Error('Internal Error During Payment Initiation');
      }

      console.log("Redirecting to PhonePe payment:", redirectUrl);
      window.location.href = redirectUrl;

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
    } else if (paymentMethod === "FULL_COD") {
      handleFullCODOrder();
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
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:py-10">


      <div className="mx-auto max-w-7xl">
        <h1 className="mb-7 text-center text-3xl font-bold text-gray-800 md:text-4xl">
          Confirm Your Order
        </h1>

        {/* Three-column layout for Address, Payment, and Cart Summary */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left Column: Address */}
          <div className="order-3 lg:order-1">
            <AddressCard address={address} />
          </div>

          {/* Middle Column: Payment Method */}
          <div className="order-1 lg:order-2">
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
              allowedMethods={paymentRules.allowedMethods}
              onlineDiscountPercent={FULL_PREPAID_DISCOUNT_PERCENT}
            />
          </div>

          {/* Right Column: Cart Summary */}
          <div className="order-2 lg:order-3">
            <CartSummary
              cart={cart}
              paymentMethod={paymentMethod}
              couponDiscountPercent={coupon?.discount || 0}
            />
          </div>
        </div>

        {/* Notice when COD is blocked by a cart item */}
        {paymentRules.restriction === "PREPAID_ONLY" && (
          <p className="mt-6 text-sm text-red-600 font-medium text-center">
            Cash on Delivery is not available for this cart. Please pay online.
          </p>
        )}

        {/* Place Order Button (bottom-right) */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className={`${isProcessing ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              } transition-colors text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg`}
          >
            {isProcessing
              ? "⏳ Processing..."
              : `Place Order ${paymentMethod === "COD" ? `(Pay ₹${codAdvanceAmount} now)` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
