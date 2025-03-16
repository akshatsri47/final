"use client";
import ProductCard from "./ProductCard";
import { Product } from "../../types/types";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}