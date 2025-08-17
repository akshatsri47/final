import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import StructuredDataComponent from "@/components/StructuredData";
import { generateProductStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo";
import { Product } from "../../../../types/types";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/product/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  // const lowestPrice = Math.min(...(product.pricing?.map(p => p.price) || [0]));
  const category = product.category || "Agricultural Product";

  return {
    title: product.name,
    description: product.description || `High-quality ${category.toLowerCase()} for agricultural use.`,
    keywords: [
      product.name,
      category,
      "agricultural products",
      "farming",
      "crop protection",
      "herbicides",
      "pesticides",
      "fertilizers"
    ],
    openGraph: {
      title: `${product.name} | PaceIT`,
      description: product.description || `High-quality ${category.toLowerCase()} for agricultural use.`,
      url: `https://paceit.com/product/${id}`,
      images: [
        {
          url: product.images?.[0] || "/banner1.jpg",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | PaceIT`,
      description: product.description || `High-quality ${category.toLowerCase()} for agricultural use.`,
      images: [product.images?.[0] || "/banner1.jpg"],
    },
    alternates: {
      canonical: `https://paceit.com/product/${id}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Generate structured data
  const productStructuredData = generateProductStructuredData({
    id: product.id,
    name: product.name,
    description: product.description || "",
    images: product.images || [],
    pricing: product.pricing || [],
    category: product.category || "",
    url: `https://paceit.com/product/${id}`,
  });

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: "Home", url: "https://paceit.com" },
    { name: "Products", url: "https://paceit.com/product" },
    { name: product.category || "Agricultural Products", url: `https://paceit.com/product?category=${product.category}` },
    { name: product.name, url: `https://paceit.com/product/${id}` },
  ]);

  return (
    <>
      <StructuredDataComponent data={productStructuredData} />
      <StructuredDataComponent data={breadcrumbStructuredData} />
      <ProductDetailClient product={product} />
    </>
  );
}
