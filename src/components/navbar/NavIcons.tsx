"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Languages } from "lucide-react";
import { useLogout } from "@/app/hooks/uselogout";
import SupportIcon from "../Supporticon";

// interface GoogleTranslateConfig {
//   pageLanguage: string;
//   includedLanguages: string;
//   autoDisplay: boolean;
//   layout: unknown; // Replace 'unknown' with the specific type if known
// }



declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: {
          new (config: unknown, elementId: string): void;
          InlineLayout: {
            SIMPLE: unknown;
            VERTICAL: unknown;
            HORIZONTAL: unknown;
          };
        };
      };
    };
  }
}



export default function NavIcons() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en"); 
  const [isMounted, setIsMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const handleLogout = useLogout();

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const toggleLanguage = () => setIsLanguageOpen(!isLanguageOpen);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize Google Translate - only runs on client
  useEffect(() => {
    if (!isMounted) return;

    // Check current language
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue;
      }
      return null;
    };

    const googleTranslateCookie = getCookie('googtrans');
    if (googleTranslateCookie && googleTranslateCookie.includes('/hi')) {
      setCurrentLanguage("hi");
    }

    // Add Google Translate script if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      
      // Define the callback function
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
        );
      };
    }
  }, [isMounted]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMounted]);

  // Function to change language
  const changeLanguage = (langCode: string) => {
    if (!isMounted) return;
    
    // Change Google Translate language
    const selectLanguage = (langCode: string) => {
      // Get the dropdown element
      const $googleTranslateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      
      if ($googleTranslateElement) {
        $googleTranslateElement.value = langCode;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        $googleTranslateElement.dispatchEvent(event);
      }
    };
    
    selectLanguage(langCode);
    setCurrentLanguage(langCode);
    setIsLanguageOpen(false); // Close dropdown after selection
  };

  return (
    <div className="flex items-center space-x-1 md:space-x-4">
      <Link href="/cart" className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Shopping cart">
        <ShoppingCart className="h-5 w-5 text-white" />
      </Link>
      
      <div ref={profileRef} className="relative">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleProfile();
          }} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
          aria-label="User profile"
          aria-expanded={isProfileOpen}
        >
          <User className="h-5 w-5 text-white" />
        </button>
        
        {isProfileOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md w-48 overflow-hidden z-50 border border-gray-100">
            <ul className="py-1">
              
              <li className="hover:bg-gray-50 transition-colors">
                <Link href="/orders" className="block px-4 py-2 text-gray-800">Orders</Link>
              </li><li className="hover:bg-gray-50 transition-colors">
                <Link href="/auth" className="block px-4 py-2 text-gray-800">Login</Link>
              </li>
              <li className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 text-red-600 font-medium"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      
      <div ref={languageRef} className="relative">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleLanguage();
          }} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
          aria-label="Change language"
          aria-expanded={isLanguageOpen}
        >
          <Languages className="h-5 w-5 text-white" strokeWidth={1.75} />
        </button>
        
        {isLanguageOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md w-48 overflow-hidden z-50 border border-gray-100">
            <ul className="py-1">
              <li className="hover:bg-gray-50 transition-colors">
                <button 
                  onClick={() => changeLanguage("en")} 
                  className={`w-full text-left px-4 py-2 ${currentLanguage === "en" ? "font-medium text-blue-600" : "text-gray-800"}`}
                >
                  English
                </button>
              </li>
              <li className="hover:bg-gray-50 transition-colors">
                <button 
                  onClick={() => changeLanguage("hi")} 
                  className={`w-full text-left px-4 py-2 ${currentLanguage === "hi" ? "font-medium text-blue-600" : "text-gray-800"}`}
                >
                  हिंदी (Hindi)
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Hidden Google Translate Element - only rendered on client */}
      {isMounted && <div id="google_translate_element" className="hidden"></div>}
      <SupportIcon />
    </div>
  );
}
