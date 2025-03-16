import React from "react";
import { Product } from "../../types/types";
import ProductCard from "./ProductCard";

interface ProductRecommendationProps {
  products: Product[];
  onBack: () => void;
  isLoading: boolean;
}

const ProductRecommendation: React.FC<ProductRecommendationProps> = ({ products, onBack, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Recommended Products</h2>
      {products.length === 0 ? (
        <p className="text-gray-500 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-center">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ProductRecommendation;
