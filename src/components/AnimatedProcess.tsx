"use client";

import React, { useEffect } from "react";

export default function AnimatedProcess() {
  // Load the dotLottie player script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@dotlottie/player-component@1.0.0/dist/dotlottie-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Process steps data
  const steps = [
    {
      number: "STEP 1",
      title: "Diagnose Disease",
      lottieUrl: "https://lottie.host/e5c3263d-554f-4271-9154-559aedc22d19/sc5LNMF6rL.lottie"
    },
    {
      number: "STEP 2",
      title: "Product Selection",
      lottieUrl: "https://lottie.host/efd96528-3fb4-4bd6-9454-54d02e1a4d44/QwT0JkZtoq.lottie"
    },
    {
      number: "STEP 3",
      title: "Order Product",
      lottieUrl: "https://lottie.host/1afa6671-cd72-4917-b68d-afce33ca1b6d/4wN9SgrJRL.lottie"
    },
    {
      number: "STEP 4",
      title: "Get Delivery",
      lottieUrl: "https://lottie.host/f8475161-27db-4d78-9073-38b7484775f3/SOzlc60sVK.lottie"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="mb-12 text-xl italic text-[#ccb26b] relative inline-block">
        Our Process
        <span className="absolute bottom-0 left-1/2 w-16 h-1 bg-[#ccb26b] transform -translate-x-1/2 mt-1"></span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="group relative">
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/4 left-full w-full h-0.5 bg-gray-200 z-0 transform -translate-y-1/2">
                <div className="absolute right-0 w-3 h-3 bg-[#ccb26b] rounded-full transform translate-x-1/2 -translate-y-1/3"></div>
              </div>
            )}
            
            <div className="bg-white rounded-lg p-6 transition-all duration-500 hover:shadow-lg relative z-10">
              {/* Animation container */}
              <div className="w-32 h-32 mx-auto mb-4 flex justify-center items-center">
                {/* Using dangerouslySetInnerHTML to insert the custom element */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
                      <dotlottie-player
                        src="${step.lottieUrl}"
                        background="transparent"
                        speed="1"
                        style="width: 100%; height: 100%"
                        loop
                        autoplay
                      ></dotlottie-player>
                    `
                  }}
                />
              </div>
              
              {/* Step number with animated background */}
              <div className="inline-block px-4 py-1 rounded-full bg-gray-100 text-[#ccb26b] font-medium mb-3 transition-colors duration-300 group-hover:bg-[#ccb26b] group-hover:text-white">
                {step.number}
              </div>
              
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {step.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}