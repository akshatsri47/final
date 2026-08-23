// components/cart/CartSummary.tsx

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { CartItem } from "../../types/types";
import { COD_ADVANCE_PERCENT, FULL_PREPAID_DISCOUNT_PERCENT, PaymentMethod, roundCurrency } from "../lib/paymentEligibility";
interface CartSummaryProps {
  cart: CartItem[];
  paymentMethod?: PaymentMethod;
  couponDiscountPercent?: number;
}

export const calculateCheckoutTotals = (cart: CartItem[], couponDiscountPercent = 0, paymentMethod?: PaymentMethod) => {
  // Shipping and tax are currently included as zero-value order charges. Keep the
  // calculation explicit so the final order value remains the payment source of truth.
  const shippingCost = 0;
  const taxAmount = 0;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const safeCouponDiscountPercent = Math.min(Math.max(couponDiscountPercent, 0), 100);
  const couponDiscount = Math.round((subtotal * safeCouponDiscountPercent)) / 100;
  const totalBeforePaymentDiscount = roundCurrency(subtotal - couponDiscount + shippingCost + taxAmount);
  const onlinePaymentDiscount = paymentMethod === "ONLINE"
    ? roundCurrency((totalBeforePaymentDiscount * FULL_PREPAID_DISCOUNT_PERCENT) / 100)
    : 0;
  const total = roundCurrency(totalBeforePaymentDiscount - onlinePaymentDiscount);

  return { subtotal, shippingCost, taxAmount, couponDiscount, onlinePaymentDiscount, totalBeforePaymentDiscount, total };
};

export const CartSummary: React.FC<CartSummaryProps> = ({ cart, paymentMethod, couponDiscountPercent = 0 }) => {
  const { subtotal, shippingCost, taxAmount, couponDiscount, onlinePaymentDiscount, total } = calculateCheckoutTotals(cart, couponDiscountPercent, paymentMethod);
  // COD: 15% is paid online now, the remaining 85% is collected on delivery (no surcharge)
  const codAdvance = paymentMethod === "COD" ? roundCurrency((total * COD_ADVANCE_PERCENT) / 100) : 0;
  const codDue = roundCurrency(total - codAdvance);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
        Cart Summary
      </h2>

      {/* List each item without images */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {cart.map((item: CartItem) => (
          <div key={uuidv4()} className="rounded-xl border border-gray-200 p-5">
            <p className="text-lg font-medium leading-snug text-gray-900">{item.name}</p>
            {item.packageSize && (
              <p className="text-sm text-gray-500">Size: {item.packageSize}</p>
            )}
            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
            {/* Remove "Added at" if you want it even cleaner, or leave it if needed */}
            <p className="text-xs text-gray-400 mt-1">
              Added at: {new Date(item.addedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Order Summary Section */}
      <div className="mb-5 mt-8 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
        <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-950">
          <span className="text-2xl" aria-hidden="true">🛒</span>
          Order Summary
        </h3>
        <span className="text-xl font-bold text-gray-950">₹{total}</span>
      </div>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-800">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-800">₹{shippingCost}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Coupon discount</span>
            <span className="text-green-700">−₹{couponDiscount}</span>
          </div>
        )}
        {onlinePaymentDiscount > 0 && (
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600">Full prepaid discount ({FULL_PREPAID_DISCOUNT_PERCENT}%)</span>
            <span className="font-medium text-green-700">−₹{onlinePaymentDiscount}</span>
          </div>
        )}
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Taxes</span>
          <span className="text-gray-800">₹{taxAmount}</span>
        </div>
        <div className="flex justify-between font-semibold text-base mt-2">
          <span>Total order value</span>
          <span>₹{total}</span>
        </div>
      </div>
      {paymentMethod === "COD" && subtotal > 0 && (
        <div className="mt-5 overflow-hidden rounded-2xl border-2 border-amber-400 bg-white">
          <div className="grid grid-cols-[1fr_auto] gap-4 bg-amber-50/60 px-5 py-5">
            <div>
              <p className="text-xl font-bold text-stone-900">Pay Now</p>
              <p className="mt-1 text-sm italic leading-relaxed text-stone-700">
                Pay {COD_ADVANCE_PERCENT}% as a small booking amount to place your Partial COD order
              </p>
            </div>
            <p className="text-xl font-bold text-stone-900">₹{codAdvance}</p>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4 border-t border-amber-200 px-5 py-5">
            <div>
              <p className="text-xl font-bold text-stone-900">Pay on Delivery</p>
              <p className="mt-1 text-sm italic leading-relaxed text-stone-700">
                Pay the remaining {100 - COD_ADVANCE_PERCENT}% balance when your order is delivered
              </p>
            </div>
            <p className="text-xl font-bold text-stone-900">₹{codDue}</p>
          </div>
        </div>
      )}
    </section>
  );
};

// (Optional) helper function if used externally
export const calculateCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
};
