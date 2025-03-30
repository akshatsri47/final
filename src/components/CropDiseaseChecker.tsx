"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const CropDiseaseChecker = () => {
  return (
    <section className="bg-gradient-to-tr from-green-100 via-emerald-200 to-lime-100 p-8 rounded-3xl shadow-xl max-w-6xl mx-auto my-12">
      <motion.div
        className="grid md:grid-cols-2 gap-10 items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left: Image & Crop Showcase */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-green-900">Select Your Crop & Issue</h2>
          <p className="text-gray-700">
            Browse through real images of common crop diseases and select the one that matches
            what you&apos;re seeing in your field. Our tool will suggest possible problems and treatments.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              {
                name: "Tomato - Leaf Spot",
                img: "https://www.thespruceeats.com/thmb/PeDv5678yT2NsJrjiIsFeri5jYk=/2400x1589/filters:fill(auto,1)/tomatoes2x-56a495155f9b58b7d0d7ae11.jpg",
              },
              {
                name: "Wheat - Rust",
                img: "https://lms.su.edu.pk/storage/uploads/1587106950-wheat.jpg",
              },
              {
                name: "Rice - Sheath Blight",
                img: "https://cdn.britannica.com/89/140889-050-EC3F00BF/Ripening-heads-rice-Oryza-sativa.jpg",
              },
            ].map((crop, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <div className="relative w-full h-28">
                  <Image
                    src={crop.img}
                    alt={crop.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  />
                </div>
                <div className="px-3 py-2 text-sm font-medium text-center text-green-900">
                  {crop.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Description & CTA */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200">
          <motion.div
            className="space-y-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-emerald-800 mb-3">🌿 How It Works</h3>
            <ul className="text-gray-700 list-disc list-inside space-y-2 text-base leading-relaxed">
              <li>Start by selecting the type of crop you&apos;re growing</li>
              <li>Select the specific disease from our categorized list</li>
              <li>Get recommended treatments along with suitable products</li>
              <li>
                Need more help? Instantly connect with a verified agriculture expert at{" "}
                <a
                  href="tel:9109109866"
                  className="text-green-700 font-semibold hover:underline"
                >
                  +91 9109109866
                </a>
              </li>
            </ul>

            <Link href="/Questionnaire">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-green-700 text-white px-6 py-3 rounded-lg shadow hover:bg-green-800 transition"
              >
                Start Diagnosis
              </motion.button>
            </Link>

            <p className="text-sm text-gray-500 text-center">
              Takes less than 2 minutes — No login required
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CropDiseaseChecker;
