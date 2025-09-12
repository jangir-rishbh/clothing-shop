"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// डमी कार्ट डेटा
const initialCartItems = [
  {
    id: "1",
    name: "पुरुषों की शर्ट",
    price: 899,
    image: "https://placehold.co/200x300/2563eb/white?text=Shirt",
    quantity: 1,
    size: "L",
    color: "नीला"
  },
  {
    id: "2",
    name: "महिलाओं की साड़ी",
    price: 1499,
    image: "https://placehold.co/200x300/7c3aed/white?text=Saree",
    quantity: 1,
    size: "फ्री साइज",
    color: "लाल"
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  
  // कार्ट से आइटम हटाने का फंक्शन
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  // क्वांटिटी अपडेट करने का फंक्शन
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // सबटोटल कैलकुलेट करने का फंक्शन
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // डिलीवरी चार्ज
  const deliveryCharge = calculateSubtotal() > 500 ? 0 : 50;
  
  // टोटल
  const total = calculateSubtotal() + deliveryCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">आपका कार्ट</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl mb-6">आपका कार्ट खाली है</p>
          <Link href="/products" className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors">
            शॉपिंग जारी रखें
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* कार्ट आइटम्स */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="p-6">
                    <div className="flex flex-col sm:flex-row">
                      {/* प्रोडक्ट इमेज */}
                      <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          style={{ objectFit: "cover" }} 
                        />
                      </div>
                      
                      {/* प्रोडक्ट डिटेल्स */}
                      <div className="mt-4 sm:mt-0 sm:ml-6 flex-grow">
                        <div className="flex justify-between">
                          <h2 className="text-lg font-medium">{item.name}</h2>
                          <p className="text-lg font-medium">₹{item.price.toLocaleString()}</p>
                        </div>
                        <p className="text-gray-500 mt-1">साइज: {item.size}</p>
                        <p className="text-gray-500">रंग: {item.color}</p>
                        
                        <div className="flex justify-between items-center mt-4">
                          {/* क्वांटिटी सेलेक्टर */}
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 border border-gray-300 rounded-l-md"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 border-t border-b border-gray-300">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 border border-gray-300 rounded-r-md"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* रिमूव बटन */}
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            हटाएं
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* ऑर्डर समरी */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-medium mb-6">ऑर्डर समरी</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p>सबटोटल</p>
                  <p>₹{calculateSubtotal().toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p>डिलीवरी चार्ज</p>
                  <p>{deliveryCharge === 0 ? 'फ्री' : `₹${deliveryCharge}`}</p>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-medium">
                    <p>टोटल</p>
                    <p>₹{total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-purple-600 text-white py-3 rounded-md font-medium mt-6 hover:bg-purple-700 transition-colors">
                चेकआउट करें
              </button>
              
              <div className="mt-6">
                <Link href="/products" className="text-purple-600 hover:text-purple-800 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  शॉपिंग जारी रखें
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}