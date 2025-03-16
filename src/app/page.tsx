import Link from "next/link";
import ProductGrid from "../components/ProductGrid";
import Testimonials from "../components/Testimonials";
import { Product } from "../../types/types";
import ShopByCategory from "../components/ShopByCategory"; 
import Whatweoffer from "../components/Whatweoffer"
import AnimatedProcess from "../components/AnimatedProcess";
import Review from "../components/Review";
import Features from "@/components/Highlight";
import Slider from "@/components/Slider";

export const dynamic = "force-dynamic"; // Forces SSR

async function fetchProducts(): Promise<{ products: Product[]; error: string | null }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/product`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();

    return {
      products: data.data.map((product: Product) => ({
        id: product.id,
        name: product.name,
        description: product.description || "No description available",
        category: product.category || "Uncategorized",
        pricing: Array.isArray(product.pricing)
          ? product.pricing.map((p) => ({
              packageSize: p.packageSize || "Default",
              price: typeof p.price === "string" ? parseFloat(p.price) : p.price || 0,
            }))
          : [],
        images: product.images?.length ? product.images : ["/images/sample-product.jpg"],
      })),
      error: null,
    };
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    return { products: [], error: "Failed to load products" };
  }
}

export default async function ProductList() {
  const { products, error } = await fetchProducts();

  return (
    <>
      {/* HERO / SLIDER */}
      <Slider />
      
      {/* SHOP BY CATEGORY */}
      <ShopByCategory />

      {/* HIGHLIGHT ROW */}
      <Features />

      {/* LATEST PRODUCTS */}
      <section className="py-10 bg-[#f9f9f9]">
        <div className="container mx-auto text-center">
          <h2 className="mb-8 text-2xl font-semibold">Latest Products</h2>
          
          {/* Questionnaire Button */}
          <div className="mb-6">
            <Link href="/Questionnaire">
              <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                Take Questionnaire
              </button>
            </Link>
          </div>

          {error ? (
            <p className="text-red-500 text-lg">❌ {error}</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>

      <AnimatedProcess />
      <Whatweoffer />

      {/* REVIEWS */}
      <Review />

      {/* TESTIMONIALS */}
      <section className="py-10 bg-[#f9f9f9]">
        <Testimonials />
      </section>

      {/* FOOTER */}
      <footer className="bg-[#4f8e42] text-white py-5 text-center">
        {/* Footer content here */}
      </footer>
    </>
  );
}
