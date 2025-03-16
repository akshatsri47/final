// components/navbar/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import NavLogo from "../components/navbar/NavLogo";
import DesktopNavLinks from "../components/navbar/DesktopNavLinks";
import SearchBar from "../components/navbar/SearchBar";
import NavIcons from "../components/navbar/NavIcons";
import MobileMenu from "../components/navbar/MobileMenu";
import MobileSearch from "../components/navbar/MobileSearch";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Handle navbar transparency on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-emerald-900 py-2 shadow-lg" : "bg-emerald-800 py-4"
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <NavLogo />

          {/* Desktop Navigation Links */}
          <DesktopNavLinks />

          {/* Centered Search Bar - Desktop */}
          <SearchBar />

          {/* Icons on the Right */}
          <NavIcons />
        </div>

        {/* Mobile Search */}
        <MobileSearch isMenuOpen={isMenuOpen} />

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && <MobileMenu />}
      </nav>

      {/* Pushes the main content below the fixed navbar */}
      <div className="h-20" />
    </>
  );
}
