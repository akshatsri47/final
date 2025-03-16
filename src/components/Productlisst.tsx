import React, { useState } from 'react';
import { Product, Pricing } from '../../types/types';
import Image from "next/image"; 
interface ProductListProps {
  products: Product[];
  onBack: () => void;
  isLoading: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, onBack, isLoading }) => {
  // State to track selected package size for each product
  const [selectedPackage, setSelectedPackage] = useState<Record<string, number>>({});

  // Handler for package size selection
  const handlePackageSelect = (productId: string, pricingIndex: number) => {
    setSelectedPackage({
      ...selectedPackage,
      [productId]: pricingIndex
    });
  };

  // Get the selected pricing or default to the first one
  const getSelectedPricing = (product: Product): Pricing => {
    const pricingIndex = selectedPackage[product.id] || 0;
    return product.pricing[pricingIndex];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
        <p className="text-gray-600 mb-6">No products found for this combination. Please try a different selection.</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Back to Selection
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Recommended Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const selectedPricing = getSelectedPricing(product);
          const discountedPrice = product.discount 
            ? selectedPricing.price - (selectedPricing.price * (product.discount / 100))
            : selectedPricing.price;
            
          return (
            <div 
              key={product.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden relative">
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.discount}% OFF
                  </div>
                )}
               <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  width={200} 
                  height={200} 
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <span className="text-xs text-gray-500">{product.manufacturer}</span>
                </div>
                <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
                
                {/* Package size selector */}
                <div className="mb-3">
                  <label className="text-sm text-gray-600 block mb-1">Package Size:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.pricing.map((pricing, index) => (
                      <button
                        key={index}
                        onClick={() => handlePackageSelect(product.id, index)}
                        className={`text-xs px-2 py-1 border rounded-md ${
                          (selectedPackage[product.id] === index || 
                          (selectedPackage[product.id] === undefined && index === 0)) 
                            ? 'bg-green-100 border-green-500' 
                            : 'border-gray-300'
                        }`}
                      >
                        {pricing.packageSize}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Dosage information */}
                <div className="mb-3">
  <p className="text-xs text-gray-600">
    <span className="font-medium">Dosage:</span> {product.dosage.method}
  </p>
  {product.dosage?.dosage && product.dosage.dosage.length > 0 ? (
    product.dosage.dosage.map((item, idx) => (
      <p key={idx} className="text-xs text-gray-600">
        <span className="font-medium">Amount {idx + 1}:</span> {item.dose} per {item.arce}
      </p>
    ))
  ) : (
    <p className="text-xs text-gray-600">No dosage data</p>
  )}
</div>

                <div className="flex justify-between items-center">
                  <div>
                    {product.discount ? (
                      <div>
                        <span className="text-gray-500 line-through text-sm">₹{selectedPricing.price.toFixed(2)}</span>
                        <span className="text-green-600 font-bold ml-2">₹{discountedPrice.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-green-600 font-bold">₹{selectedPricing.price.toFixed(2)}</span>
                    )}
                  </div>
                  <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
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

export default ProductList;