"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { session, signOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/home';
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsUserMenuOpen(false);
    }
  };

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/home' },
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="group relative">
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
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md transition-colors ${
                  pathname === item.href 
                    ? 'bg-white/20 text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {!loading && (
              session ? (
                <div className="relative ml-4">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-600 focus:ring-white"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-purple-600 font-semibold">
                      {session.user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/login?signup=true');
                    }}
                    className="px-4 py-2 bg-white text-purple-600 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
          
          {/* Mobile menu */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/home"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {!loading && (
                session ? (
                  <div className="pt-4 pb-3 border-t border-white/20 mt-4">
                    <div className="flex items-center px-5">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-purple-600 font-semibold">
                        {session.user?.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">
                          {session.user?.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                      <Link
                        href="/profile"
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 pb-3 border-t border-white/20 mt-4 space-y-2">
                    <Link
                      href="/login"
                      className="block w-full px-4 py-2 text-center text-base font-medium text-white hover:bg-white/10 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/login"
                      className="block w-full px-4 py-2 text-center text-base font-medium text-purple-600 bg-white rounded-md hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        router.push('/login?signup=true');
                      }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )
              )}
            </div>
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
  </nav>
);
}