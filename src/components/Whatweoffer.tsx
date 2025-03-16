"use client"
import { motion } from "framer-motion";
import { Leaf, Award, TrendingUp, Truck } from "lucide-react";

export default function Whatweoffer() {
  const services = [
    {
      id: 1,
      title: "Quality Standards",
      description: "Ensuring the highest standards in farming and harvesting.",
      icon: <Award className="w-10 h-10 text-emerald-600" />
    },
    {
      id: 2,
      title: "Organic Farming",
      description: "Zero chemicals, purely organic produce from certified farms.",
      icon: <Leaf className="w-10 h-10 text-emerald-600" />
    },
    {
      id: 3,
      title: "Agriculture Products",
      description: "Wide range of fresh, local, and healthy produce.",
      icon: <TrendingUp className="w-10 h-10 text-emerald-600" />
    },
    {
      id: 4,
      title: "Farm-to-Table",
      description: "Delivering fresh harvest straight to your doorstep.",
      icon: <Truck className="w-10 h-10 text-emerald-600" />
    }
  ];

  return (
    <section className="py-16 bg-[url('/images/wheat-pattern.png')] bg-cover bg-center bg-no-repeat text-center relative">
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-8 relative">
        {/* Section Title */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[#ccb26b] font-medium uppercase mb-2"
        >
          Our Services
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold mb-12"
        >
          What We Offer
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300"
            >
              <div className="p-8">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}