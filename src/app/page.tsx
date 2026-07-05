import { Metadata } from "next";
import CategorySection from "@/components/CategorySection";
import { Product } from "../../types/types";
import ShopByCategory from "../components/ShopByCategory"; 
import Whatweoffer from "../components/Whatweoffer";
import AnimatedProcess from "../components/AnimatedProcess";
import Features from "@/components/Highlight";
import Slider from "@/components/Slider";
import CropDiseaseChecker from "@/components/CropDiseaseChecker";
import QuestionnaireAlert from "@/components/QuestionnaireAlert";
import { normalizeCategory } from "../../utils/normalizeCategory";
import StructuredDataComponent from "@/components/StructuredData";
import { generateLocalBusinessStructuredData, generateFAQStructuredData } from "@/lib/seo";

export const dynamic = "force-dynamic"; // Forces SSR

export const metadata: Metadata = {
  title: "Agricultural Solutions & Products",
  description: "Discover high-quality agricultural products including herbicides, pesticides, fertilizers, and crop protection solutions. Expert advice and reliable products for modern farming.",
  keywords: [
    "agricultural products",
    "herbicides",
    "pesticides", 
    "fertilizers",
    "crop protection",
    "farming solutions",
    "agriculture products India",
    "weed control",
    "plant protection"
  ],
  openGraph: {
    title: "Agricultural Solutions & Products | PaceIT",
    description: "Discover high-quality agricultural products including herbicides, pesticides, fertilizers, and crop protection solutions.",
    url: "https://paceit.com",
    images: [
      {
        url: "/banner1.jpg",
        width: 1200,
        height: 630,
        alt: "PaceIT Agricultural Solutions",
      },
    ],
  },
  alternates: {
    canonical: "https://paceit.com",
  },
};

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
  // Group by the original product.category (not the slug)
  const groupedProducts: { [key: string]: Product[] } = products.reduce(
    (acc, product) => {
      const cat = product.category || "Uncategorized";
      const normalizedCat = normalizeCategory(cat);
      if (!acc[normalizedCat]) acc[normalizedCat] = [];
      acc[normalizedCat].push(product);
      return acc;
    },
    {} as { [key: string]: Product[] }
  );

  // FAQ data for structured data
  const faqs = [
    {
      question: "What agricultural products does PaceIT offer?",
      answer: "PaceIT offers a comprehensive range of agricultural products including herbicides, pesticides, fertilizers, and crop protection solutions for modern farming needs."
    },
    {
      question: "How can I get expert advice on crop protection?",
      answer: "Our team of agricultural experts provides personalized advice through our questionnaire system and direct consultation services to help you choose the right products."
    },
    {
      question: "Do you ship agricultural products across India?",
      answer: "Yes, we provide reliable shipping services across India with secure packaging and tracking for all our agricultural products."
    }
  ];
  
  return (
    <>
      <StructuredDataComponent data={generateLocalBusinessStructuredData()} />
      <StructuredDataComponent data={generateFAQStructuredData(faqs)} />
      
      {/* HERO / SLIDER */}
      <Slider />
      
      {/* SHOP BY CATEGORY */}
      <ShopByCategory />

      {/* HIGHLIGHT ROW */}
      <Features />
      
      {/* CROP DISEASE CHECKER */}
      <CropDiseaseChecker />
      
      {/* LATEST PRODUCTS */}
      <section className="py-10 bg-[#f9f9f9]">
        <div className="container mx-auto text-center">
          <h2 className="mb-8 text-2xl font-semibold">Latest Products</h2>
          {error ? (
            <p className="text-red-500 text-lg">❌ {error}</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            Object.entries(groupedProducts).map(([category, catProducts]) => (
              <CategorySection
                key={category}
                category={category} // original category from backend (e.g., "herbicide/weedicide")
                products={catProducts}
              />
            ))
          )}
        </div>
      </section>

      <AnimatedProcess />
      <Whatweoffer />

      {/* FOOTER */}
      <footer className="bg-[#4f8e42] text-white py-5 text-center">
        {/* Footer content here */}
      </footer>
      <QuestionnaireAlert />
      <a
        href="https://wa.me/917470884789"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:bg-[#1ebe5d]"
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-8 w-8"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.04 3C9.39 3 4 8.39 4 15.04c0 2.12.55 4.19 1.6 6.01L4 29l8.14-1.54a12.05 12.05 0 0 0 3.9.64C22.69 28.1 28.08 22.71 28.08 16.06S22.69 3 16.04 3Zm0 22.97c-1.28 0-2.53-.26-3.7-.77l-.26-.11-4.84.92.96-4.72-.14-.28a9.94 9.94 0 0 1-1.54-5.97c0-5.31 4.32-9.63 9.63-9.63s9.63 4.32 9.63 9.63-4.43 10.93-9.74 10.93Zm5.28-7.22c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.14-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.33.43-.49.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36s-1 1-1 2.42 1.03 2.8 1.18 2.99c.14.19 2.03 3.1 4.92 4.35.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.36-.07-.12-.26-.19-.55-.33Z" />
        </svg>
      </a>

    </>
  );
}
