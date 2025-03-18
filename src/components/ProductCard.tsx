import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Product } from "../../types/types";
import api from "../app/utils/api";
import { useCoupon } from "@/app/context/CouponContext";

export interface PricingOption {
  packageSize: string;
  price: number;
  discount?: number;
}

interface ExamProduct extends Product {
  discount?: number;
}

export default function ProductCard({ product }: { product: ExamProduct }) {
  const router = useRouter();
  const { coupon } = useCoupon();
  const [selectedPrice, setSelectedPrice] = useState<PricingOption | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [userId, setUserId] = useState<string>('');

  // Get product images
  const productImage = product.images?.[0]
    ? product.images[0].replace('/upload/', '/upload/f_auto,q_auto/')
    : '/images.png';

  // Load userId from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId') || '';
      setUserId(storedUserId);
    }
  }, []);

  // Set default pricing option
  useEffect(() => {
    if (product?.pricing && product.pricing.length > 0) {
      setSelectedPrice(product.pricing[0]);
    }
  }, [product]);

  // Calculate price & discount
  const { originalPrice, discountedPrice, appliedDiscount } = useMemo(() => {
    if (!selectedPrice) return { originalPrice: 'N/A', discountedPrice: 'N/A', appliedDiscount: 0 };

    const discountedPrice = Number(selectedPrice.price);
    if (isNaN(discountedPrice)) {
      console.error('Invalid price value:', selectedPrice.price);
      return { originalPrice: 'N/A', discountedPrice: 'N/A', appliedDiscount: 0 };
    }

    const discountFromCoupon = coupon?.discount ?? 0;
    const discountFromProduct = product.discount ?? 0;
    const appliedDiscount = Math.max(discountFromCoupon, discountFromProduct);
    const originalPrice = (discountedPrice + (discountedPrice * appliedDiscount) / 100).toFixed(2);

    return { originalPrice, discountedPrice: discountedPrice.toFixed(2), appliedDiscount };
  }, [selectedPrice, coupon, product.discount]);

  // Add item to cart
  const addToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userId) {
      alert(' Please log in.');
      router.push("/auth");
      return;
    }
    
    if (!selectedPrice) {
      alert('Please select a package size.');
      return;
    }

    try {
      const response = await api.put('/cart', {
        userId,
        productId: product.id,
        quantity: 1,
        packageSize: selectedPrice.packageSize,
      });

      if (response.data.success) {
        alert('✅ Product added to cart!');
      } else {
        alert('❌ Failed to add to cart.');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('❌ Error adding to cart. Please try again.');
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    const selected = product.pricing?.find(
      (p) => p.packageSize === e.target.value
    );
    
    if (selected) {
      setSelectedPrice(selected);
    }
  };

  return (
    <div 
      className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {appliedDiscount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
            {appliedDiscount}% OFF
          </div>
        )}
        <Link href={`/product/${product.id}`} className="block">
          <div className="mt-7 w-full h-52 relative overflow-hidden">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className={`object-contain transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
              priority
            />
          </div>
        </Link>
      </div>
      
      <div className="p-4">
        <Link href={`/product/${product.id}`} className="block">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>
          <h2 className="text-lg font-medium text-gray-800 mb-3">{product.name}</h2>
        </Link>
        
        {/* Package Size Selector - Removed from Link */}
        <div onClick={(e) => e.stopPropagation()}>
          <select
            id="pricing"
            name="pricing"
            className="w-full py-2 px-3 border border-gray-200 rounded text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
            value={selectedPrice?.packageSize || ""}
            onChange={handleDropdownChange}
            onClick={(e) => e.stopPropagation()}
          >
            {product.pricing?.map((option, index) => (
              <option key={index} value={option.packageSize}>
                {option.packageSize}
              </option>
            ))}
          </select>
        </div>

        {selectedPrice && (
          <div className="mt-3 flex items-end justify-between">
            <Link href={`/product/${product.id}`} className="block">
              <div>
                {appliedDiscount > 0 && (
                  <span className="block text-gray-500 line-through text-xs">₹{originalPrice}</span>
                )}
                <span className="text-lg font-semibold text-gray-900">₹{discountedPrice}</span>
              </div>
            </Link>

            {/* Add to Cart Button - Removed from Link */}
            <div onClick={(e) => e.stopPropagation()}>
              <button 
                className={`text-white text-sm px-4 py-2 rounded-md transition-all duration-300 ${
                  isHovered ? 'bg-emerald-600' : 'bg-emerald-500'
                }`}
                onClick={addToCart}
              >
                Add to Cart 
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}