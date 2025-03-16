"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
  { 
    quote: "Best service ever!", 
    name: "Samarth Gupta", 
    designation: "Co-Owner", 
    src: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
  },
  { 
    quote: "Amazing experience!", 
    name: "Pankaj Gupta", 
    designation: "Owner", 
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative h-72 w-full">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: index === active ? 1 : 0.7, 
                  scale: index === active ? 1 : 0.95 
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0"
                // Set higher z-index for active testimonial
                style={{ zIndex: index === active ? 10 : 5 }}
              >
                <Image
                  src={testimonial.src}
                  alt={testimonial.name}
                  width={500}
                  height={500}
                  draggable={false}
                  className="h-full w-full rounded-2xl object-cover"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex flex-col justify-between">
          <motion.div 
            key={active} 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-gray-900">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-gray-500">
              {testimonials[active].designation}
            </p>
            <motion.p className="text-lg text-gray-500 mt-6">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span 
                  key={index} 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.2, delay: 0.02 * index }} 
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-4 pt-6">
            <button 
              onClick={handlePrev} 
              className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              onClick={handleNext} 
              className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center"
            >
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
