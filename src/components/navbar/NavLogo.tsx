"use client";
import Link from "next/link";
import Image from "next/image";

export default function NavLogo() {
  return (
    <div className="flex-shrink-0">
      <Link 
        href="/" 
        className="flex items-center transition-transform hover:scale-105"
        aria-label="Krashi Doctor home"
      >
        <Image
          src="/brand-logo.png"
          alt="Krashi Doctor - Gupta Trading Company"
          width={108}
          height={81}
          priority
          className="h-14 w-auto object-contain mix-blend-multiply md:h-16"
        />
      </Link>
    </div>
  );
}
