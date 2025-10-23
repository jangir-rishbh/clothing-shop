'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
}

interface AdminClientLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
}

export default function AdminClientLayout({ children, navItems }: AdminClientLayoutProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Set menuOpen to true on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(true);
      } else {
        setMenuOpen(false);
      }
    };

    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Set loaded state
    setIsLoaded(true);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (window.innerWidth < 768 && 
          menuOpen && 
          !target.closest('aside') && 
          !target.closest('button[data-menu-toggle]')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 transition-all duration-500 ease-in-out">
      {/* Overlay for mobile */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      {/* Sidebar with gradient and animation */}
      <aside 
        className={`fixed md:static bg-gradient-to-b from-indigo-900 via-purple-800 to-blue-900 text-white w-[280px] md:w-64 h-screen overflow-y-auto z-30 transition-all duration-300 ease-in-out transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="p-4 font-bold text-xl border-b border-indigo-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-blue-300">
              Admin Panel
            </span>
          </div>
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(false)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-4 pb-20 md:pb-0">
          <ul>
            {navItems.map((item, index) => {
              // Choose an icon based on the label
              const icon = (
                <svg className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {item.label.toLowerCase().includes('dashboard') && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                  {item.label.toLowerCase().includes('product') && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
                  {item.label.toLowerCase().includes('user') && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                  {item.label.toLowerCase().includes('order') && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />}
                  {item.label.toLowerCase().includes('notice') && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />}
                  {item.label.toLowerCase().includes('massage') && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
                  {!item.label.toLowerCase().includes('dashboard') && 
                   !item.label.toLowerCase().includes('product') && 
                   !item.label.toLowerCase().includes('user') && 
                   !item.label.toLowerCase().includes('order') && 
                   !item.label.toLowerCase().includes('notice') && 
                   !item.label.toLowerCase().includes('massage') && 
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              );
              
              return (
                <li key={index} className="mb-2 transform transition-transform duration-200 hover:scale-105">
                  <Link 
                    href={item.href} 
                    className={`group flex items-center px-4 py-2 hover:bg-indigo-700 transition-all duration-200 ${
                      pathname === item.href 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-l-4 border-pink-400 shadow-lg' 
                        : 'hover:translate-x-1'
                    }`}
                    onClick={() => window.innerWidth < 768 && setMenuOpen(false)}
                  >
                    {icon}
                    <span className="relative">
                      {item.label}
                      {pathname === item.href && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-pink-300 animate-pulse"></span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="mb-2 transform transition-transform duration-200 hover:scale-105">
              <Link 
                href="/admin/profile" 
                className={`group flex items-center px-4 py-2 hover:bg-indigo-700 transition-all duration-200 ${
                  pathname === '/admin/profile' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-l-4 border-pink-400 shadow-lg' 
                    : 'hover:translate-x-1'
                }`}
                onClick={() => window.innerWidth < 768 && setMenuOpen(false)}
              >
                <svg className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="relative">
                  Profile
                  {pathname === '/admin/profile' && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-pink-300 animate-pulse"></span>
                  )}
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header with gradient */}
        <header className="bg-gradient-to-r from-white to-blue-50 shadow-md p-4 flex items-center justify-between">
          <button 
            data-menu-toggle
            onClick={() => setMenuOpen(!menuOpen)} 
            className="text-indigo-600 focus:outline-none transition-transform duration-300 transform hover:scale-110"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Dashboard</div>
          <div className="flex items-center">
            <span className="text-sm text-indigo-600 mr-2 animate-bounce">Admin</span>
          </div>
        </header>

        {/* Main content with animation */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 transition-all duration-500 ${
          isLoaded ? 'translate-y-0' : 'translate-y-10'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}