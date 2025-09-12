"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link href={`/products/${id}`}>
        <div className="relative h-64 w-full">
          <Image 
            src={image} 
            alt={name} 
            fill 
            style={{ objectFit: "cover" }} 
            className="transition-opacity duration-300 hover:opacity-90"
          />
        </div>
        <div className="p-4">
          <span className="text-xs text-purple-600 font-semibold">{category}</span>
          <h3 className="text-lg font-semibold mt-1">{name}</h3>
          <p className="text-gray-700 mt-1">₹{price.toLocaleString()}</p>
          <button className="mt-3 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors">
            कार्ट में जोड़ें
          </button>
        </div>
      </Link>
    </div>
  );
}