import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found - 404 Error",
  description: "The page you're looking for doesn't exist. Browse our agricultural products and solutions.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-green-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
                         The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
          >
            Go Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try these popular pages:</p>
            <div className="mt-2 space-x-4">
              <Link href="/product" className="text-green-600 hover:underline">
                Products
              </Link>
              <Link href="/about" className="text-green-600 hover:underline">
                About Us
              </Link>
              <Link href="/contact" className="text-green-600 hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
