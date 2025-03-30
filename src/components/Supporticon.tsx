"use client";
import { useState, useEffect } from "react";
import { PhoneCall } from "lucide-react";

// Hook to detect if the device is mobile (width < 768px)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function SupportIcon() {
  const supportNumber = "9109109866";
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mobile: Clicking opens the phone dialer via tel: link.
  if (isMobile) {
    return (
      <a
        href={`tel:${supportNumber}`}
        className="text-white bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
        aria-label="Call Support"
      >
        <PhoneCall className="h-5 w-5" />
      </a>
    );
  }

  // Desktop: Clicking toggles a dropdown displaying the support number.
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="text-white bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
        aria-label="Support"
      >
        <PhoneCall className="h-5 w-5" />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg p-2">
          <p className="text-center font-medium">{supportNumber}</p>
        </div>
      )}
    </div>
  );
}
