import { useRouter } from "next/navigation";
import { useQuantity } from "../app/hooks/useQuantity";
import { useUserId } from "../app/hooks/useId";
import { Product } from "../../types/types";
import api from "../app/utils/api"; 
import { useState, useEffect } from "react";

interface PricingOption {
  packageSize: string;
  price: number;
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { quantity, increaseQuantity, decreaseQuantity } = useQuantity();
  const [adding, setAdding] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PricingOption | null>(null);
  const userId = useUserId();
  const router = useRouter();

  // Set the first package size and price as default on component mount
  useEffect(() => {
    if (product && product.pricing && product.pricing.length > 0) {
      setSelectedPrice(product.pricing[0]);
    }
  }, [product]);

  const addToCart = async () => {
    if (!product || quantity < 1 || !selectedPrice) return;
    setAdding(true);
    
    try {
      await api.put("/cart", {
        userId,
        productId: product.id,
        quantity,
        packageSize: selectedPrice.packageSize,
        price: selectedPrice.price,
      });
      alert(`✅ ${quantity} item(s) added to cart!`);
    } catch (err) {
      if (!userId) {
        alert("Please login to add products to cart");
        router.push("/auth");
      } else {
        console.error("❌ Error adding to cart:", err);
        alert("⚠️ Failed to add product to cart.");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-lg text-gray-700 mt-2">{product.description}</p>
      <p className="text-md text-gray-600">Category: {product.category}</p>

      <div className="bg-white shadow-lg border p-6 rounded-lg mt-6 w-full md:w-3/4">
        <label htmlFor="packageSize" className="block text-sm font-medium text-gray-700">
          Select Package Size
        </label>
        <select
          id="packageSize"
          name="packageSize"
          className="border p-2 w-full rounded-md mb-4"
          value={selectedPrice?.packageSize || ""}
          onChange={(e) => {
            const selected = product.pricing.find(
              (p) => p.packageSize === e.target.value
            );
            setSelectedPrice(selected || null);
          }}
        >
          {product.pricing.map((option, index) => (
            <option key={index} value={option.packageSize}>
              {option.packageSize}
            </option>
          ))}
        </select>
        {selectedPrice && (
          <p className="text-2xl font-bold">₹{selectedPrice.price}</p>
        )}

        <p className="text-gray-600">Inclusive of all taxes</p>

        <div className="mt-4">
          <p className="font-semibold">Quantity:</p>
          <div className="flex gap-3 mt-2">
            <button onClick={decreaseQuantity} className="px-4 py-2 bg-gray-200 rounded-md">
              ➖
            </button>
            <p className="text-lg font-bold">{quantity}</p>
            <button onClick={increaseQuantity} className="px-4 py-2 bg-gray-200 rounded-md">
              ➕
            </button>
          </div>
        </div>

        <button
          onClick={addToCart}
          className={`w-full bg-yellow-500 text-white py-2 rounded-md font-semibold ${
            adding ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={adding || !selectedPrice}
        >
          {adding ? "Adding..." : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
}