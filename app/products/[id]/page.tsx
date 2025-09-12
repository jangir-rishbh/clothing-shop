"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

// डमी प्रोडक्ट डेटा
const products = [
  {
    id: "1",
    name: "पुरुषों की शर्ट",
    price: 899,
    image: "https://placehold.co/800x1000/2563eb/white?text=Shirt",
    category: "पुरुष",
    description: "उच्च गुणवत्ता वाली कॉटन शर्ट जो आरामदायक और टिकाऊ है। विभिन्न रंगों और आकारों में उपलब्ध।",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["सफेद", "नीला", "काला"],
    inStock: true
  },
  {
    id: "2",
    name: "महिलाओं की साड़ी",
    price: 1499,
    image: "https://placehold.co/800x1000/7c3aed/white?text=Saree",
    category: "महिला",
    description: "सुंदर डिज़ाइन वाली साड़ी जो हर अवसर के लिए उपयुक्त है। उच्च गुणवत्ता वाले कपड़े से बनी।",
    sizes: ["फ्री साइज"],
    colors: ["लाल", "हरा", "पीला"],
    inStock: true
  },
  // अन्य प्रोडक्ट्स...
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">प्रोडक्ट नहीं मिला</h1>
        <p>माफ़ करें, आपके द्वारा खोजा गया प्रोडक्ट मौजूद नहीं है।</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    // कार्ट में जोड़ने की फंक्शनैलिटी यहां जोड़ें
    alert(`${product.name} कार्ट में जोड़ा गया!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* प्रोडक्ट इमेज */}
        <div className="relative h-96 md:h-[600px] rounded-lg overflow-hidden">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            style={{ objectFit: "cover" }} 
            className="rounded-lg"
          />
        </div>
        
        {/* प्रोडक्ट डिटेल्स */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-purple-600 mt-2">₹{product.price.toLocaleString()}</p>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold">विवरण</h2>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>
          
          {/* साइज सेलेक्टर */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">साइज</h2>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md ${selectedSize === size ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* कलर सेलेक्टर */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">रंग</h2>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-md ${selectedColor === color ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          
          {/* क्वांटिटी सेलेक्टर */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">मात्रा</h2>
            <div className="flex items-center">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border border-gray-300 rounded-l-md"
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b border-gray-300">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border border-gray-300 rounded-r-md"
              >
                +
              </button>
            </div>
          </div>
          
          {/* एड टू कार्ट बटन */}
          <div className="mt-8">
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-3 rounded-md font-medium ${product.inStock ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              {product.inStock ? 'कार्ट में जोड़ें' : 'स्टॉक में नहीं है'}
            </button>
          </div>
          
          {/* डिलीवरी इंफो */}
          <div className="mt-8 p-4 bg-gray-50 rounded-md">
            <h2 className="text-lg font-semibold mb-2">डिलीवरी जानकारी</h2>
            <p className="text-gray-600">सभी ऑर्डर 5-7 कार्य दिवसों में डिलीवर किए जाते हैं।</p>
            <p className="text-gray-600 mt-2">₹500 से अधिक के ऑर्डर पर फ्री डिलीवरी।</p>
          </div>
        </div>
      </div>
    </div>
  );
}