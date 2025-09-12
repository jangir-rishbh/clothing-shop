"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              मा बाबा क्लॉथ स्टोर
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="px-3 py-2 text-gray-700 hover:text-purple-600">
              होम
            </Link>
            <Link href="/products" className="px-3 py-2 text-gray-700 hover:text-purple-600">
              प्रोडक्ट्स
            </Link>
            <Link href="/about" className="px-3 py-2 text-gray-700 hover:text-purple-600">
              हमारे बारे में
            </Link>
            <Link href="/contact" className="px-3 py-2 text-gray-700 hover:text-purple-600">
              संपर्क करें
            </Link>
            <Link href="/cart" className="px-3 py-2 text-gray-700 hover:text-purple-600">
              <span className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
              </span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none"
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
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
            होम
          </Link>
          <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
            प्रोडक्ट्स
          </Link>
          <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
            हमारे बारे में
          </Link>
          <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
            संपर्क करें
          </Link>
          <Link href="/cart" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
            कार्ट
          </Link>
        </div>
      </div>
    </nav>
  );
}