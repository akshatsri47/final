"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function QuestionnaireAlert() {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Show the alert after 2 seconds
    const timer = setTimeout(() => {
      setShowAlert(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 bg-green-600 text-white shadow-lg rounded-lg px-6 py-4 w-[300px] max-w-full"
        >
          <div className="flex flex-col space-y-2">
          <p className="font-semibold text-lg">🌱 Krashi Doctor</p>

            <p className="text-sm">
              Take our quick questionnaire to get crop-specific disease & treatment suggestions.
            </p>
            <Link
              href="/Questionnaire"
              className="bg-white text-green-700 font-medium text-sm px-4 py-2 rounded-md mt-2 text-center hover:bg-green-100 transition"
            >
              Take Questionnaire
            </Link>
            <button
              onClick={() => setShowAlert(false)}
              className="absolute top-2 right-2 text-white text-sm hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
