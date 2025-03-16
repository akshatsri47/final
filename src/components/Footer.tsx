 export default function Footer() {
    return (
      <footer className="w-full bg-black text-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          
          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-semibold text-white">The Company</h3>
              <p className="text-sm text-gray-400 mt-2">
                Your go-to destination for quality products and top-notch service.
              </p>
            </div>
  
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="mt-2 space-y-2">
                <li className="cursor-pointer  hover:text-orange">Home</li>
                <li className="cursor-pointer  hover:text-orange">Products</li>
                <li className="cursor-pointer  hover:text-orange">Cart</li>
                <li className="cursor-pointer  hover:text-orange">Contact</li>
                <li className="cursor-pointer  hover:text-orange">About Us</li>
              </ul>
            </div>
  
            {/* Social Media Links */}
            <div>
              <h4 className="text-lg font-semibold text-white">Stay Connected</h4>
              <div className="flex justify-center md:justify-start mt-2 space-x-4">
                <span className="cursor-pointer text-gray-400 hover:text-blue-400">Twitter</span>
                <span className="cursor-pointer text-gray-400 hover:text-blue-400">Facebook</span>
                <span className="cursor-pointer text-gray-400 hover:text-blue-400">Instagram</span>
                <span className="cursor-pointer text-gray-400 hover:text-blue-400">LinkedIn</span>
              </div>
            </div>
  
          </div>
  
          {/* Footer Bottom */}
          <div className="border-t border-gray-700 mt-6 py-3 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} The Company. All rights reserved.
          </div>
  
        </div>
      </footer>
    )
}