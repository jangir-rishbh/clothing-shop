'use client';

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import ProductCard from "../components/ProductCard";

// Clothing collection with different categories
const featuredProducts = [
  // Sarees
  {
    id: "s1",
    name: "Banarasi Silk Saree",
    price: 5499,
    image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
    category: "Saree"
  },
  {
    id: "s2",
    name: "Kanjivaram Silk",
    price: 6999,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "Saree"
  },
  
  // Suits
  {
    id: "st1",
    name: "Designer Suit Set",
    price: 4299,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1136&q=80",
    category: "Suit"
  },
  {
    id: "st2",
    name: "Party Wear Suit",
    price: 3599,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    category: "Suit"
  },
  
  // Jeans
  {
    id: "j1",
    name: "Slim Fit Jeans",
    price: 1799,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80",
    category: "Jeans"
  },
  {
    id: "j2",
    name: "Ripped Jeans",
    price: 2199,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80",
    category: "Jeans"
  },
  
  // Pants
  {
    id: "p1",
    name: "Formal Trousers",
    price: 1599,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    category: "Pants"
  },
  {
    id: "p2",
    name: "Casual Chinos",
    price: 1399,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1136&q=80",
    category: "Pants"
  }
];

// Categories
const categories = [
  { name: "Sarees", image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", link: "/products?category=saree" },
  { name: "Suits", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", link: "/products?category=suit" },
  { name: "Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", link: "/products?category=jeans" },
  { name: "Pants", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", link: "/products?category=pants" },
];

export default function HomePage() {
  const {} = useAuth();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom');

  useEffect(() => {
    if (redirectedFrom) {
      // Show a toast or message that the user needs to log in
      console.log(`Please log in to access ${redirectedFrom}`);
      // Remove the redirectedFrom parameter from the URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('redirectedFrom');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [redirectedFrom]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            {redirectedFrom && (
              <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                Please log in to access {redirectedFrom}
              </div>
            )}
            <div className="text-center">
              <div className="inline-block text-left">
                <h1 className="text-5xl md:text-7xl font-serif italic font-bold text-white mb-4">
                  <span className="relative">
                    <span className="text-yellow-300/70 block mb-2">Welcome to</span>
                    <div className="space-y-1">
                      <span className="text-white text-4xl md:text-6xl font-serif italic">
                        <span className="text-yellow-300">Ma Baba</span>
                        <span className="text-white"> Cloth Store</span>
                      </span>
                    </div>
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 font-light tracking-wider mt-6 max-w-2xl mx-auto">
                  Elegant Clothing & Fashion for the Modern You
                </p>
              </div>
            </div>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Your most trusted clothing store in town, where you can visit and choose your favorite items in person
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg inline-block">
              <p className="text-yellow-300 text-lg mb-4">
                🏪 In-Store Shopping Only | No Home Delivery Available
              </p>
              <Link 
                href="/products" 
                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Visit Store
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link key={index} href={category.link} className="group">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
