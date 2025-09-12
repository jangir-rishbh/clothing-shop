"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-gray-200 transition-colors">
Ma Baba Cloth Store
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors">
              Home
            </Link>
            <Link href="/products" className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors">
              Products
            </Link>
            <Link href="/about" className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors">
              Contact
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 focus:outline-none"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-gradient-to-b from-purple-700 to-indigo-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" className="block px-4 py-3 text-white hover:bg-white/10 rounded-md transition-colors">
            Home
          </Link>
          <Link href="/products" className="block px-4 py-3 text-white hover:bg-white/10 rounded-md transition-colors">
            Products
          </Link>
          <Link href="/about" className="block px-4 py-3 text-white hover:bg-white/10 rounded-md transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="block px-4 py-3 text-white hover:bg-white/10 rounded-md transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}