"use client";

import { useState } from "react";
import ProductCard from "../components/ProductCard";

// डमी प्रोडक्ट डेटा
const products = [
  {
    id: "1",
    name: "पुरुषों की शर्ट",
    price: 899,
    image: "https://placehold.co/400x600/2563eb/white?text=Shirt",
    category: "पुरुष"
  },
  {
    id: "2",
    name: "महिलाओं की साड़ी",
    price: 1499,
    image: "https://placehold.co/400x600/7c3aed/white?text=Saree",
    category: "महिला"
  },
  {
    id: "3",
    name: "बच्चों का सूट",
    price: 699,
    image: "https://placehold.co/400x600/10b981/white?text=Kids+Suit",
    category: "बच्चे"
  },
  {
    id: "4",
    name: "जींस पैंट",
    price: 999,
    image: "https://placehold.co/400x600/1e40af/white?text=Jeans",
    category: "पुरुष"
  },
  {
    id: "5",
    name: "महिलाओं का सूट",
    price: 1299,
    image: "https://placehold.co/400x600/8b5cf6/white?text=Women+Suit",
    category: "महिला"
  },
  {
    id: "6",
    name: "बच्चों की टी-शर्ट",
    price: 499,
    image: "https://placehold.co/400x600/10b981/white?text=Kids+Tshirt",
    category: "बच्चे"
  },
  {
    id: "7",
    name: "पुरुषों का कुर्ता",
    price: 1199,
    image: "https://placehold.co/400x600/2563eb/white?text=Kurta",
    category: "पुरुष"
  },
  {
    id: "8",
    name: "महिलाओं का लहंगा",
    price: 2499,
    image: "https://placehold.co/400x600/7c3aed/white?text=Lehenga",
    category: "महिला"
  },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>("featured");

  // फिल्टर्ड प्रोडक्ट्स
  const filteredProducts = products.filter(product => {
    // श्रेणी फिल्टर
    if (selectedCategory && product.category !== selectedCategory) return false;
    
    // कीमत फिल्टर
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    
    return true;
  }).sort((a, b) => {
    // सॉर्टिंग
    if (sortBy === "price-low-high") return a.price - b.price;
    if (sortBy === "price-high-low") return b.price - a.price;
    return 0; // डिफॉल्ट (featured)
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">सभी प्रोडक्ट्स</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* फिल्टर साइडबार */}
        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">फिल्टर्स</h2>
          
          {/* श्रेणी फिल्टर */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">श्रेणी</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="category" 
                  value=""
                  checked={selectedCategory === ""}
                  onChange={() => setSelectedCategory("")}
                  className="mr-2"
                />
                सभी
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="category" 
                  value="पुरुष"
                  checked={selectedCategory === "पुरुष"}
                  onChange={() => setSelectedCategory("पुरुष")}
                  className="mr-2"
                />
                पुरुष
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="category" 
                  value="महिला"
                  checked={selectedCategory === "महिला"}
                  onChange={() => setSelectedCategory("महिला")}
                  className="mr-2"
                />
                महिला
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="category" 
                  value="बच्चे"
                  checked={selectedCategory === "बच्चे"}
                  onChange={() => setSelectedCategory("बच्चे")}
                  className="mr-2"
                />
                बच्चे
              </label>
            </div>
          </div>
          
          {/* कीमत फिल्टर */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">कीमत रेंज</h3>
            <div className="flex items-center space-x-2">
              <span>₹{priceRange[0]}</span>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-full"
              />
              <span>₹{priceRange[1]}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span>₹0</span>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <span>₹5000</span>
            </div>
          </div>
          
          {/* सॉर्ट बाय */}
          <div>
            <h3 className="text-lg font-medium mb-2">सॉर्ट बाय</h3>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="featured">फीचर्ड</option>
              <option value="price-low-high">कीमत: कम से ज्यादा</option>
              <option value="price-high-low">कीमत: ज्यादा से कम</option>
            </select>
          </div>
        </div>
        
        {/* प्रोडक्ट्स ग्रिड */}
        <div className="w-full md:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl">कोई प्रोडक्ट नहीं मिला।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
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
          )}
        </div>
      </div>
    </div>
  );
}