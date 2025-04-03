import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-100 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold text-white">
              Gupta Trading Company
            </h3>
            <p className="text-sm text-gray-400 mt-2">
              Your go-to destination for quality products and top-notch service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="mt-2 space-y-2">
              <li className="cursor-pointer hover:text-orange">
                <Link href="/">Home</Link>
              </li>
              <li className="cursor-pointer hover:text-orange">
                <Link href="/product">Products</Link>
              </li>
              <li className="cursor-pointer hover:text-orange">
                <Link href="/cart">Cart</Link>
              </li>
              <li className="cursor-pointer hover:text-orange">
                <Link href="/contact">Contact</Link>
              </li>
              <li className="cursor-pointer hover:text-orange">
                <Link href="/about">About Us</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-6 py-3 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Gupta Trading Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
