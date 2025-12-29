'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Users, Package, MessageSquare } from 'lucide-react';

interface AdminClientLayoutProps {
  children: ReactNode;
  navItems: {
    href: string;
    label: string;
  }[];
}

export default function AdminClientLayout({ children, navItems }: AdminClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close mobile sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsMobileSidebarOpen(false);
  };

  // Navigation icons for mobile
  const getNavIcon = (label: string) => {
    switch (label) {
      case 'Dashboard': return <Home className="h-5 w-5" />;
      case 'Users': return <Users className="h-5 w-5" />;
      case 'Products': return <Package className="h-5 w-5" />;
      case 'Massage': return <MessageSquare className="h-5 w-5" />;
      default: return <Home className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="lg:hidden fixed top-8 left-4 z-50 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
      >
        {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 
        bg-indigo-800 dark:bg-gray-800 text-white 
        z-50 lg:z-auto
        transition-all duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}
        w-64 h-full
      `}>
        <div className="p-4 flex justify-between items-center">
          <h2 className={`font-bold text-xl ${isSidebarOpen ? 'block' : 'hidden'} lg:block transition-all duration-300`}>Admin Panel</h2>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-700 hover:bg-indigo-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link 
                  href={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 
                    ${
                      pathname === item.href 
                        ? 'bg-indigo-900 dark:bg-gray-700 border-l-4 border-white' 
                        : 'hover:bg-indigo-700 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <span className="flex-shrink-0">{getNavIcon(item.label)}</span>
                  <span className={`ml-3 block`}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 lg:ml-0">
        <main className="p-4 lg:p-6 min-h-full pt-16 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}