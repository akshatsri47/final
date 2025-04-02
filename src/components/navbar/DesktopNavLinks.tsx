"use client";
import Link from "next/link";

export default function DesktopNavLinks() {
  return (
    <div className="hidden md:flex items-center space-x-6 text-white/90 font-medium">
      <Link href="/" className="hover:text-white hover:underline underline-offset-4 transition-colors">Home</Link>
      <Link href="/product" className="hover:text-white hover:underline underline-offset-4 transition-colors">Products</Link>
      <Link href="/about" className="hover:text-white hover:underline underline-offset-4 transition-colors">About</Link>
      <Link href="/contact" className="hover:text-white hover:underline underline-offset-4 transition-colors">Contact</Link>
      <Link href="/warehouse" className="hover:text-white hover:underline underline-offset-4 transition-colors">Warehouse</Link>
      <Link href="/PrivacyPolicy" className="hover:text-white hover:underline underline-offset-4 transition-colors">Privacy and Policy</Link>

      
    </div>
  );
}
