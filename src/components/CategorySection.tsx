"use client";
import { useState } from "react";
import ProductGrid from "./ProductGrid";
import { Product } from "../../types/types";

interface CategorySectionProps {
  category: string;
  products: Product[];
}

export default function CategorySection({ category, products }: CategorySectionProps) {
  const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 products

  return (
    // Give each category an ID for anchor links (replace spaces with hyphens).
    <div
      id={category.toLowerCase().replace(/\s+/g, "-")}
      className="mb-10"
    >
      <h2 className="text-3xl font-bold mb-4 bg-[#81b622] text-white p-2">
        {category.toUpperCase()}
      </h2>
      <ProductGrid products={products.slice(0, visibleCount)} />
      {visibleCount < products.length && (
        <button
          onClick={() => setVisibleCount(products.length)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Show More
        </button>
      )}
    </div>
  );
}
