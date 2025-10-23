"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiShoppingCart, FiEye } from "react-icons/fi";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string; // kept for API compatibility
  category: string;
}

export default function ProductCard({ id, name, price, category }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [overrideUrl, setOverrideUrl] = useState<string | null>(null);
  const placeholder = 'https://placehold.co/800x600/png?text=No+Image';

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch('/api/products/overrides', { cache: 'no-store' });
        const data = await resp.json();
        const found = (data.overrides || []).find((o: { product_id: string; image?: string }) => o.product_id === id);
        if (mounted) setOverrideUrl(found?.image || null);
      } catch {}
    })();
    return () => { mounted = false; };
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <Link href={`/products/${id}`} className="block">
        {/* Product Image */}
        <div className="relative h-80 w-full overflow-hidden">
          <Image 
            src={overrideUrl || placeholder} 
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            className="group-hover:scale-110 transition-transform duration-500 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          
          {/* Badge */}
          <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            New
          </div>
          
          
          {/* Quick Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex justify-center space-x-2 mb-3">
                <button 
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-pink-100 hover:text-pink-600 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowQuickView(true);
                  }}
                  aria-label="Quick view"
                >
                  <FiEye className="w-5 h-5" />
                </button>
                <button 
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-pink-100 hover:text-pink-600 transition-colors"
                  aria-label="Add to cart"
                >
                  <FiShoppingCart className="w-5 h-5" />
                </button>
                
              </div>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-pink-600 truncate">{category}</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-1 truncate">{name}</h3>
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-500 ml-1">(24)</span>
              </div>
            </div>
            <div className="ml-4 text-right">
              <p className="text-lg font-bold text-gray-900">{formatPrice(price)}</p>
            </div>
          </div>
          
          {/* Color Variants */}
          <div className="flex space-x-2 mt-3">
            {['bg-red-500', 'bg-blue-500', 'bg-black', 'bg-yellow-400'].map((color, index) => (
              <span 
                key={index} 
                className={`w-5 h-5 rounded-full ${color} border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-pink-500 transition-all`}
                title={`Color ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Link>
      
      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Quick View</h3>
                <button 
                  onClick={() => setShowQuickView(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <Image 
                    src={overrideUrl || placeholder}
                    alt={name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">(24 reviews)</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-4">{formatPrice(price)}</p>
                  <p className="text-gray-600 mt-4">
                    Elevate your style with our premium {category.toLowerCase()}. Made with high-quality materials for maximum comfort and durability.
                  </p>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900">Color</h4>
                    <div className="flex space-x-2 mt-2">
                      {['Red', 'Blue', 'Black', 'Yellow'].map((color, index) => (
                        <button
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          style={{ backgroundColor: ['#EF4444', '#3B82F6', '#000000', '#F59E0B'][index] }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900">Size</h4>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <button
                          key={size}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 flex space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button className="px-3 py-2 text-gray-600 hover:bg-gray-100">-</button>
                      <span className="px-3">1</span>
                      <button className="px-3 py-2 text-gray-600 hover:bg-gray-100">+</button>
                    </div>
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-6 rounded-md font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}