import Link from "next/link";
import { redirect } from 'next/navigation';

export default function LandingPage() {
  // Redirect to /home by default
  redirect('/home');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm hover:shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center group">
              <Link href="/" className="flex items-center">
                <div className="relative">
                  {/* Animated gradient background */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-400 rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  
                  {/* Logo container */}
                  <div className="relative px-5 py-3 bg-white ring-1 ring-gray-200 rounded-lg flex items-center space-x-3 group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Initials circle */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      MB
                    </div>
                    
                    {/* Text */}
                    <div className="text-left">
                      <div className="flex items-baseline">
                        <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-serif italic tracking-tight">
                          Ma Baba
                        </span>
                        <span className="ml-2 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-white px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      </div>
                      <div className="flex items-center mt-0.5">
                        <span className="h-0.5 w-4 bg-gradient-to-r from-purple-400 to-pink-400 mr-1.5"></span>
                        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Fashion Emporium</span>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -right-1 -top-1 w-3 h-3 bg-pink-400 rounded-full opacity-70"></div>
                    <div className="absolute -right-1 -bottom-1 w-2 h-2 bg-purple-400 rounded-full opacity-70"></div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { name: 'Home', href: '/home' },
                { name: 'New Arrivals', href: '/new-arrivals' },
                { name: 'Collections', href: '/collections' },
                { name: 'Sale', href: '/sale' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors relative group/nav"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover/nav:w-full group-hover/nav:left-0"></span>
                </Link>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-full transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-pink-500"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-full transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
              
              <div className="hidden md:flex items-center space-x-2 ml-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Join Now
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button className="text-gray-700 hover:text-purple-600 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {['Home', 'New Arrivals', 'Collections', 'Sale', 'About', 'Contact'].map((item) => (
              <a href="#" key={item} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-purple-600">
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-lg font-medium text-purple-600 mb-2">Welcome to</span>
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Ma Baba
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-purple-100 -z-0 opacity-70"></span>
              </span>
              <span className="block mt-1 text-3xl sm:text-4xl md:text-5xl font-light text-gray-800">
                Fashion Emporium
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Elevate your wardrobe with our premium collection of ethnic and western wear, carefully curated for the modern Indian consumer.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link 
                href="/home"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-200"
              >
                Shop Now
              </Link>
              <Link 
                href="/about"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-full text-purple-700 bg-purple-100 hover:bg-purple-200 md:py-4 md:text-lg md:px-10 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to shop
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Premium Quality',
                  description: 'We source only the finest fabrics and materials for our clothing.',
                  icon: '✨',
                },
                {
                  name: 'Trending Styles',
                  description: 'Stay ahead of fashion trends with our latest collections.',
                  icon: '👕',
                },
                {
                  name: 'Easy Returns',
                  description: 'Not satisfied? We offer hassle-free returns within 7 days.',
                  icon: '🔄',
                },
              ].map((feature) => (
                <div key={feature.name} className="pt-6
                ">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md shadow-lg text-2xl w-16 h-16">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Shop</h3>
              <ul className="mt-4 space-y-4">
                {['New Arrivals', 'Best Sellers', 'Sale', 'Collections'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Customer Service</h3>
              <ul className="mt-4 space-y-4">
                {['Contact Us', 'FAQs', 'Shipping', 'Returns'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About Us</h3>
              <ul className="mt-4 space-y-4">
                {['Our Story', 'Blog', 'Careers', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-base text-gray-300 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
              <div className="flex space-x-6 mt-4">
                {['Facebook', 'Instagram', 'Twitter', 'Pinterest'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">{social}</span>
                    <span className="text-xl">{social === 'Facebook' ? '📘' : social === 'Instagram' ? '📸' : social === 'Twitter' ? '🐦' : '📌'}</span>
                  </a>
                ))}
              </div>
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Subscribe to our newsletter</h4>
                <div className="mt-4 flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 rounded-l-md focus:outline-none text-gray-900 w-full"
                  />
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Ma Baba Cloth Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
