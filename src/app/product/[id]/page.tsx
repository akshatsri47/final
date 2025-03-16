"use client";
import React from "react";

import { useRouter, useParams } from "next/navigation";
import { useProduct } from "../../hooks/useProduct";
import ProductImageGallery from "../../../components/ProductGallery";
import ProductDetails from "../../../components/ProductDetail";
import { useState, useEffect } from "react";
import { Product } from "../../../../types/types";
import Image from "next/image";
import api from "../../utils/api";



export default function ProductDetail() {
  const params = useParams();
  const productId = params?.id as string;
  const { product, loading, error } = useProduct(productId);
  const router = useRouter();

  // -- HOT DEALS STATE --
  const [hotDeals, setHotDeals] = useState<Product[]>([]);
  const [dealLoading, setDealLoading] = useState(true);
  const [dealError, setDealError] = useState("");

  // Fetch Hot Deals using the same approach as ProductList
  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        // Replace "/product" with your actual endpoint if different
        const res = await api.get<{ data: Product[] }>("/product");
        setHotDeals(res.data.data);
        console.log("🔥 Hot Deals:", res.data.data);
      } catch (err: unknown) {
        console.error("Error fetching hot deals:", err);
        setDealError("Failed to load hot deals");
      } finally {
        setDealLoading(false);
      }
    };
    fetchHotDeals();
  }, []);

  // MAIN PRODUCT LOADING/ERROR STATES
  if (loading) return <p className="text-center text-lg">⏳ Loading product...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;
  if (!product) return <p className="text-center text-gray-500">⚠️ Product not found.</p>;

  // Fallback if no images
  const placeholderImage = "/placeholder.jpg";
  const productImages = product.images?.length ? product.images : [placeholderImage];

  return (
    <>
     

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-6 py-10">
        <button
          onClick={() => router.back()}
          className="bg-gray-200 px-4 py-2 rounded mb-6"
        >
          ⬅ Back
        </button>

        {/* Product Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column: Product Image Gallery */}
          <div className="lg:w-1/3">
            <ProductImageGallery images={productImages} />
          </div>

          {/* Right Column: Product Details */}
          <div className="lg:w-2/3">
            <ProductDetails product={product} />
          </div>
        </div>

        {/* TABLES SECTION */}
        <div className="mt-10 flex flex-col md:flex-row gap-6">
          {/* TABLE 1: Product Information */}
          <div className="flex-1 min-w-[280px] bg-white border border-gray-300 rounded overflow-hidden">
            <h3 className="bg-gray-100 p-3 border-b border-gray-300 text-lg font-semibold">
              Product Information
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left text-gray-600 w-[40%]">
                    Details
                  </th>
                  <th className="py-2 px-3 text-left text-gray-600">
                    Specification
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Name */}
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 text-gray-700">Name</td>
                  <td className="py-2 px-3 text-gray-700">
                    {product.name || "N/A"}
                  </td>
                </tr>
                {/* Description */}
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 text-gray-700">Description</td>
                  <td className="py-2 px-3 text-gray-700">
                    {product.description || "N/A"}
                  </td>
                </tr>
                {/* Category */}
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 text-gray-700">Category</td>
                  <td className="py-2 px-3 text-gray-700">
                    {product.category || "N/A"}
                  </td>
                </tr>
                {/* Manufacturer */}
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 text-gray-700">Manufacturer</td>
                  <td className="py-2 px-3 text-gray-700">
                    {product.manufacturer || "N/A"}
                  </td>
                </tr>
                {/* Composition */}
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 text-gray-700">Composition</td>
                  <td className="py-2 px-3 text-gray-700">
                    {product.composition || "N/A"}
                  </td>
                </tr>
                {/* Commonly Used For (array) */}
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 text-gray-700">Commonly Used For</td>
                  <td className="py-2 px-3 text-gray-700">
                    {product.commonlyUsedFor?.length
                      ? product.commonlyUsedFor.join(", ")
                      : "N/A"}
                  </td>
                </tr>
                {/* Avoid For Crops (array) */}
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 text-gray-700">Avoid For Crops</td>
                  <td className="py-2 px-3 text-gray-700">
                    {product.avoidForCrops?.length
                      ? product.avoidForCrops.join(", ")
                      : "N/A"}
                  </td>
                </tr>
                {/* Benefits (array) */}
                <tr>
                  <td className="py-2 px-3 text-gray-700">Benefits</td>
                  <td className="py-2 px-3 text-gray-700">
                    {product.benefits?.length
                      ? product.benefits.join(", ")
                      : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TABLE 2: Dosage & Pricing */}
          <div className="flex-1 min-w-[280px] bg-white border border-gray-300 rounded overflow-hidden">
            <h3 className="bg-gray-100 p-3 border-b border-gray-300 text-lg font-semibold">
              Dosage &amp; Pricing
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left text-gray-600 w-[40%]">
                    Field
                  </th>
                  <th className="py-2 px-3 text-left text-gray-600">Info</th>
                </tr>
              </thead>
              <tbody>
                {/* Method */}
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-3 text-gray-700">Method</td>
                  <td className="py-2 px-3 text-gray-700">
                    {product.dosage?.method || "N/A"}
                  </td>
                </tr>
                {/* Dose */}
                
                {(() => {
  const dosageArray = product.dosage?.dosage;

  // If there's no dosage data or it's empty, show a fallback row.
  if (!dosageArray || dosageArray.length === 0) {
    return (
      <tr className="border-b border-gray-200">
        <td className="py-2 px-3 text-gray-700" colSpan={2}>
          No dosage data
        </td>
      </tr>
    );
  }

  // Otherwise, map over the array of dosage items.
  return dosageArray.map((item, idx) => [
    <tr key={`dose-${idx}`} className="border-b border-gray-200">
      <td className="py-2 px-3 text-gray-700">Dose (#{idx + 1})</td>
      <td className="py-2 px-3 text-gray-700">{item.dose || "N/A"}</td>
    </tr>,
    <tr key={`arce-${idx}`} className="border-b border-gray-200">
      <td className="py-2 px-3 text-gray-700">Arce (#{idx + 1})</td>
      <td className="py-2 px-3 text-gray-700">{item.arce || "N/A"}</td>
    </tr>
  ]);
})()}

                {/* Pricing (all packages) */}
                <tr>
                  <td className="py-2 px-3 text-gray-700">Pricing</td>
                  <td className="py-2 px-3 text-gray-700">
                    {product.pricing && product.pricing.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {product.pricing.map((priceObj, idx) => (
                          <li key={idx}>
                            {priceObj.packageSize} - ₹{priceObj.price}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TODAY'S HOT DEAL SECTION */}
        <section className="bg-white py-10">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Today’s Hot Deal
          </h2>

          {/* Display loading/error states if needed */}
          {dealLoading && (
            <p className="text-center text-gray-600">Loading hot deals...</p>
          )}
          {dealError && (
            <p className="text-center text-red-500">❌ {dealError}</p>
          )}

          {/* If no error and not loading, show the deals */}
          {!dealLoading && !dealError && hotDeals.length === 0 && (
            <p className="text-center text-gray-500">No hot deals found.</p>
          )}
          {!dealLoading && !dealError && hotDeals.length > 0 && (
            // Randomly select 4 items
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 place-items-center">
              {hotDeals
                .sort(() => 0.5 - Math.random()) // Shuffle
                .slice(0, 4) // Take first 4 after shuffle
                .map((deal) => {
                  const dealImage = deal.images?.[0] || "/placeholder.jpg";
                  const dealPrice = deal.pricing?.[0]?.price || 0;
                  const discountAmount = deal.discount || 20; // Example discount

                  return (
                    <a
                      key={deal.id}
                      href={`/product/${deal.id}`}
                      className="bg-[#f9f9f9] border border-gray-300 rounded p-4 text-center w-[200px]"
                    >
                   <Image
  src={dealImage}
  alt={deal.name}
  width={80}
  height={80}
  className="mx-auto object-cover mb-3"
/>
                      <p>{deal.name}</p>
                      <p className="font-semibold text-green-600">
                        ₹{dealPrice}
                      </p>
                      <p>Save: ₹{discountAmount}</p>
                    </a>
                  );
                })}
            </div>
          )}
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#4f8e42] text-white py-5 text-center mt-8">
        <div className="container mx-auto">
          <p>The Company | Contact: 666 888 0000 | needhelp@company.com</p>
          <p>SRM Chennai, Kattankulathur, Tamil Nadu</p>
          <p>© 2025 The Company | Terms of Use | Privacy Policy</p>
        </div>
      </footer>
    </>
  );
}
