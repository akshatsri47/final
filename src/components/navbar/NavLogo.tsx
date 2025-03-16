"use client";
import Link from "next/link";

export default function NavLogo() {
  return (
    <div className="flex-shrink-0">
      <Link 
        href="/" 
        className="text-2xl font-bold text-white flex items-center tracking-tight hover:scale-105 transition-transform"
      >
        <span className="mr-1">Krashi</span>
        <span className="bg-white/10 px-2 py-1 rounded">DOCTOR</span>
      </Link>
    </div>
  );
}