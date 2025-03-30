"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ShopByCategory() {
  const categories = [
    { id: 1, name: "Insecticides", image: "/category/1.png" },
    { id: 2, name: "Herbicides", image: "/category/2.png" },
    { id: 3, name: "Fungicides", image: "/category/3.png" },
    { id: 4, name: "Plant Growth Promoters", image: "/category/4.png" },
    { id: 5, name: "Broad Spectrum Herbicide", image: "/category/5.png" },
    { id: 6, name: "Hybrid Seeds", image: "/category/6.png" },
    { id: 7, name: "Seed Treatment", image: "/category/7.png" },
    { id: 8, name: "Liquid Fertilizers", image: "/category/8.png" },
    { id: 9, name: "Agriculture Machines", image: "/category/9.png" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const toId = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Shop By Category
          </h2>
          <div className="w-24 h-1 bg-green-500 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 max-w-2xl mx-auto">
  Explore our wide range of agricultural products designed to
  maximize your farm&apos;s productivity
</p>

        </div>

        {/* Category Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category) => (
            <motion.a
              key={category.id}
              href={`#${toId(category.name)}`}
              className="group w-64 flex flex-col items-center cursor-pointer"
              variants={cardVariants}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Image Wrapper */}
              <div className="relative w-52 h-52 overflow-hidden mb-4 transition-all duration-300 shadow-lg group-hover:shadow-xl border-4 border-white rounded-full bg-white flex items-center justify-center">
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300 z-0 rounded-full" />
                {/* Actual Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain p-3 z-10 transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Category Name */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                  {category.name}
                </h3>

                {/* View Products Text */}
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
