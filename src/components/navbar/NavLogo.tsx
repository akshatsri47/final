"use client";
import Link from "next/link";
import Image from "next/image";

export default function NavLogo() {
  return (
    <div className="h-16 w-20 flex-shrink-0 overflow-hidden">
      <Link 
        href="/" 
        className="flex h-full w-full items-center justify-center transition-transform hover:scale-105"
        aria-label="Krashi Doctor home"
      >
        <Image
          src="/brand-logo.png"
          alt="Krashi Doctor - Gupta Trading Company"
          width={80}
          height={64}
          priority
          className="h-16 w-20 object-contain mix-blend-multiply"
        />
      </Link>
    </div>
  );
}
