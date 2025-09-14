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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
      <Link href={`/products/${id}`}>
        <div className="relative h-72 w-full group">
          <Image 
            src={image} 
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="text-white">
              <p className="text-sm font-medium">{category}</p>
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-lg font-semibold text-yellow-300">₹{price.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
              <p className="text-sm text-gray-500">{category}</p>
            </div>
            <p className="text-lg font-bold text-purple-600">₹{price.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}