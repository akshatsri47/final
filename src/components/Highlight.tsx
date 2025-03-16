"use client";

import React from "react";
import { ShieldCheck, Leaf, Truck } from "lucide-react";

export default function Features() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 py-8 bg-white">
      <div className="text-center flex-1 min-w-[180px]">
        <ShieldCheck className="mx-auto text-green-500" size={48} />
        <h3 className="text-lg mt-2 mb-1 font-semibold">100% Branded Products</h3>
        <p className="text-gray-600">Quality you can trust</p>
      </div>
      <div className="text-center flex-1 min-w-[180px]">
        <Leaf className="mx-auto text-green-500" size={48} />
        <h3 className="text-lg mt-2 mb-1 font-semibold">100% Original Products</h3>
        <p className="text-gray-600">Grown without compromise</p>
      </div>
      <div className="text-center flex-1 min-w-[180px]">
        <Truck className="mx-auto text-green-500" size={48} />
        <h3 className="text-lg mt-2 mb-1 font-semibold">Free Delivery</h3>
        <p className="text-gray-600">On orders over ₹500</p>
      </div>
    </div>
  );
}
