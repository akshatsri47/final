"use client";
import Link from "next/link";

export default function MobileMenu() {
  return (
    <div className="md:hidden bg-greens/95 backdrop-blur-sm text-white border-t border-white/10 animate-fadeIn">
      <div className="py-2 px-4">
        <Link href="/" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
          Home
        </Link>
        <Link href="/product" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
          Products
        </Link>
        <Link href="/cart" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
          Cart
        </Link>
        <Link href="/blogs" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
          Blogs
        </Link>
        <Link href="/contact" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
          Contact
        </Link>
        <Link href="/about" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
          About Us
        </Link>
        <Link href="/warehouse" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
          Warehouse
        </Link>
        <Link href="/PrivacyPolicy" className="hover:text-white hover:underline underline-offset-4 transition-colors">Terms and Conditions</Link>

      </div>
    </div>
  );
}