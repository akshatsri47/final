// components/cart/CartSummary.tsx

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { CartItem } from "../../types/types";
interface CartSummaryProps {
  cart: CartItem[];
  paymentMethod?: "ONLINE" | "COD"; // when "COD", the online-advance / pay-on-delivery split is shown
}

const COD_ADVANCE_PERCENT = 15;

export const CartSummary: React.FC<CartSummaryProps> = ({ cart, paymentMethod }) => {
  // Example shipping cost (adjust or fetch from backend as needed)
  const shippingCost = 0;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // COD: 15% is paid online now, the remaining 85% is collected on delivery (no surcharge)
  const codAdvance = paymentMethod === "COD" ? Math.round((subtotal * COD_ADVANCE_PERCENT) / 100) : 0;
  const codDue = subtotal - codAdvance;
  const total = subtotal + shippingCost;

  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Cart Summary
      </h2>

      {/* List each item without images */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {cart.map((item: CartItem) => (
          <div key={uuidv4()} className="p-4 border rounded-lg">
            <p className="font-medium text-gray-800">{item.name}</p>
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
      <h3 className="text-lg font-semibold mt-6 mb-4">Order Summary</h3>
      <div className="border-t pt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-800">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-800">₹{shippingCost}</span>
        </div>
        {paymentMethod === "COD" && subtotal > 0 && (
          <>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Pay online now ({COD_ADVANCE_PERCENT}%)</span>
              <span className="text-green-700 font-medium">₹{codAdvance}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Pay on delivery ({100 - COD_ADVANCE_PERCENT}%)</span>
              <span className="text-gray-800">₹{codDue}</span>
            </div>
          </>
        )}
        <div className="flex justify-between font-semibold text-base mt-2">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
};

// (Optional) helper function if used externally
export const calculateCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
};
