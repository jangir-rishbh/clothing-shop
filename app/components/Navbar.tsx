"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // You'll need to manage this state properly

  const handleLogout = () => {
    // Handle logout logic here
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="group relative">
              <span className="text-2xl md:text-3xl font-serif italic font-bold text-gray-800">
                <span className="relative">
                  <span className="text-yellow-500">Ma Baba</span>
                  <span className="text-gray-800"> Cloth Store</span>
                </span>
                <span className="block text-sm font-sans not-italic font-normal tracking-wider text-gray-600 -mt-1">Elegant Clothing & Fashion</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/home" className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors">
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
            
            {isLoggedIn ? (
              <div className="relative ml-4">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-purple-600 font-bold">
                    U
                  </div>
                </button>
                
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Your Profile
                      </Link>
                      <Link 
                        href="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Your Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  href="/login" 
                  className="px-4 py-2 bg-white text-purple-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
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
          <Link href="/home" className="block px-4 py-3 text-white hover:bg-white/10 rounded-md transition-colors">
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
          
          {isLoggedIn ? (
            <>
              <div className="border-t border-white/20 pt-2">
                <Link href="/profile" className="block px-4 py-3 text-white hover:bg-white/10 rounded-md transition-colors">
                  Your Profile
                </Link>
                <Link href="/orders" className="block px-4 py-3 text-white hover:bg-white/10 rounded-md transition-colors">
                  Your Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-white/20">
              <Link 
                href="/login" 
                className="block w-full text-center px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors mb-2"
              >
                Log in
              </Link>
              <Link 
                href="/login?mode=signup" 
                className="block w-full text-center px-4 py-2 bg-white text-purple-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}