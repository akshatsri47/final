"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ShopByCategory() {
  const categories = [
    {
      id: 1,
      name: "Organic Fertilizers",
      lottieUrl:
        "https://lottie.host/2e42d2f4-49bf-48bf-90f8-c03c70040ca1/RBzFXwM8hj.lottie",
    },
    {
      id: 2,
      name: "Chemical Fertilizers",
      lottieUrl:
        "https://lottie.host/21946a0f-3b96-45ec-9543-b08af0dc2e29/wrPM9v9CkM.lottie",
    },
    {
      id: 3,
      name: "Soil Amendments",
      lottieUrl:
        "https://lottie.host/f5e9be54-0190-4944-8f0b-a7605aa6d40d/Wjt2dl5B9I.lottie",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-2xl font-medium text-center text-gray-800">
          Shop By Category
        </h2>

        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className="group flex flex-col items-center bg-white p-6 rounded-xl shadow-md transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert(`${category.name} clicked`)}
            >
              <div className="relative w-32 h-32 mb-4 overflow-hidden">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
                      <dotlottie-player
                        src="${category.lottieUrl}"
                        background="transparent"
                        speed="1"
                        style="width: 100%; height: 100%"
                        loop
                        autoplay
                      ></dotlottie-player>
                    `,
                  }}
                />
              </div>
              <p className="font-medium text-center text-gray-700">
                {category.name}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
