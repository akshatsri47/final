// src/contexts/CouponContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Coupon {
  code: string;
  discount: number;
  expiresAt?: number | null;
}

interface CouponContextProps {
  coupon: Coupon | null;
}

const CouponContext = createContext<CouponContextProps | undefined>(undefined);

export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
};

export const CouponProvider = ({ children }: { children: ReactNode }) => {
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    const fetchCoupon = async () => {
      // Check if coupon is already stored in sessionStorage
      const storedCoupon = sessionStorage.getItem('coupon');
      if (storedCoupon) {
        const parsedCoupon = JSON.parse(storedCoupon) as Coupon;
        if (!parsedCoupon.expiresAt || parsedCoupon.expiresAt > Date.now()) {
          setCoupon(parsedCoupon);
          return;
        }
        sessionStorage.removeItem('coupon');
      }

      try {
        const res = await fetch('/api/coupon');
        if (!res.ok) throw new Error(`API responded with status: ${res.status}`);

        const data = await res.json();
        const couponIsActive = !data.expiresAt || data.expiresAt > Date.now();
        if (data && typeof data.discount === 'number' && data.discount > 0 && couponIsActive) {
          const activeCoupon = { code: data.code, discount: data.discount, expiresAt: data.expiresAt ?? null };
          setCoupon(activeCoupon);
          sessionStorage.setItem('coupon', JSON.stringify(activeCoupon));
        } else {
          setCoupon(null);
        }
      } catch (error) {
        console.error('Error fetching coupon:', error);
        setCoupon(null);
      }
    };

    fetchCoupon();
  }, []);

  return (
    <CouponContext.Provider value={{ coupon }}>
      {children}
    </CouponContext.Provider>
  );
};
