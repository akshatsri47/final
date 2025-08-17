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

    </>
  );
}
