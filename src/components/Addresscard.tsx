// components/address/AddressCard.tsx
"use client"
import React from 'react';
import { Address } from '../../types/types';


interface AddressCardProps {
  address: Address;
}

export const AddressCard: React.FC<AddressCardProps> = ({ address }) => {
  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Delivery Address
      </h2>
      <div className="space-y-2 text-gray-600">
        <p>{address.name}</p>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>
          {address.city}, {address.state} {address.zip}
        </p>
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
          </svg>
          {address.phone}
        </p>
      </div>
    </div>
  );
};