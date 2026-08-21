"use client";
import Link from "next/link";

export default function NavLogo() {
  return (
    <div className="flex-shrink-0">
      <Link 
        href="/" 
        className="flex items-center text-2xl font-bold tracking-tight text-white transition-transform hover:scale-105"
        aria-label="Krashi Doctor home"
      >
        <span className="mr-1">Krashi</span>
        <span className="rounded bg-white/10 px-2 py-1">DOCTOR</span>
      </Link>
    </div>
  );
}
