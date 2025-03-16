import ProductCard from "./ProductCard";
import api from ".././app/utils/api";
import { Product } from "../../types/types";

export default async function ProductList() {
  try {
    const res = await api.get("/");
    const products = res.data.data;

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Product List</h1>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {products.length === 0 ? <p>No products found.</p> : products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return <p className="text-red-500">❌ Failed to load products</p>;
  }
}
