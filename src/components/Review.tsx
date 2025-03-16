"use client"
import { motion } from "framer-motion";

export default function Review() {
  const testimonials = [
    {
      quote: "“Lorem ipsum dolor sit amet, consectetur adipiscing elit.”",
      rating: "★★★★★"
    },
    {
      quote: "“Pellentesque habitant morbi tristique senectus et netus.”",
      rating: "★★★★★"
    },
    {
      quote: "“Quisque facilisis tellus in ipsum bibendum, sed consequat nisl congue.”",
      rating: "★★★★★"
    }
  ];

  return (
    <section className="py-10 bg-green-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-10">
          What They Say
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative bg-white w-full max-w-sm p-8 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105"
            >
              {/* Decorative circle */}
              <div className="absolute top-4 left-4 w-10 h-10 bg-green-500 rounded-full border-dashed border-2 border-green-300"></div>
              {/* Star rating */}
              <div className="mt-8 flex justify-center">
                <span className="text-green-500 text-xl">
                  {testimonial.rating}
                </span>
              </div>
              {/* Testimonial text */}
              <p className="mt-6 text-green-900 italic">
                {testimonial.quote}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
