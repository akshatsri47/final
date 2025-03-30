// components/ShopByCategory.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { categorySlugs } from "../../utils/category";

export default function ShopByCategory() {
  const categories = [
    { id: 1, backendName: "insecticide", displayName: "Insecticides", image: "/category/1.png" },
    { id: 2, backendName: "herbicide/weedicide", displayName: "Herbicides", image: "/category/2.png" },
    { id: 3, backendName: "fungicide", displayName: "Fungicides", image: "/category/3.png" },
    { id: 4, backendName: "growthbooster", displayName: "Plant Growth Promoters", image: "/category/4.png" },
    { id: 5, backendName: "pre-herbicide/weedicide", displayName: "Broad Spectrum Herbicide", image: "/category/5.png" },
    { id: 6, backendName: "hybridseeds", displayName: "Hybrid Seeds", image: "/category/6.png" },
    { id: 7, backendName: "seedtreatment", displayName: "Seed Treatment", image: "/category/7.png" },
    { id: 8, backendName: "watersolublefertilizers", displayName: "Liquid Fertilizers", image: "/category/8.png" },
    { id: 9, backendName: "agriculturalmachine", displayName: "Agriculture Machines", image: "/category/9.png" },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Shop By Category
          </h2>
          <div className="w-24 h-1 bg-green-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of agricultural products
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.a
              key={category.id}
              href={`#${categorySlugs[category.backendName]}`}
              className="group w-64 flex flex-col items-center cursor-pointer"
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-52 h-52 overflow-hidden mb-4 transition-all duration-300 shadow-lg group-hover:shadow-xl border-4 border-white rounded-full bg-white flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300 z-0 rounded-full" />
                <Image
                  src={category.image}
                  alt={category.displayName}
                  fill
                  className="object-contain p-3 z-10 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                  {category.displayName}
                </h3>
                <div className="mt-2">
                  <span className="inline-block px-4 py-1 bg-white text-green-600 text-sm font-medium rounded-full border border-green-200 shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    View Products
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
