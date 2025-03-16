"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import type { LottieComponentProps } from "lottie-react";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Loading() {
  // Properly type the state
  const [animationData, setAnimationData] = useState<LottieComponentProps["animationData"] | null>(null);

  useEffect(() => {
    // Import the animation data only on the client side
    import("../../public/loading.json").then((data) => {
      setAnimationData(data.default);
    });
  }, []);

  if (!animationData) return <div className="flex h-screen items-center justify-center bg-white">Loading...</div>;

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Lottie animationData={animationData} loop={true} className="w-48 h-48" />
    </div>
  );
}
