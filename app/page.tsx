import Link from "next/link";
import ProductCard from "./components/ProductCard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// डमी प्रोडक्ट डेटा
const featuredProducts = [
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
];

// श्रेणियां
const categories = [
  { name: "पुरुष", image: "https://placehold.co/400x300/2563eb/white?text=Men", link: "/products?category=men" },
  { name: "महिला", image: "https://placehold.co/400x300/7c3aed/white?text=Women", link: "/products?category=women" },
  { name: "बच्चे", image: "https://placehold.co/400x300/10b981/white?text=Kids", link: "/products?category=kids" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      {/* हीरो सेक्शन */}
      <section className="relative h-[70vh] bg-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              मा बाबा क्लॉथ स्टोर में आपका स्वागत है
            </h1>
            <p className="text-xl text-white mb-8">
              सभी प्रकार के कपड़े एक ही जगह पर उपलब्ध
            </p>
            <Link href="/products" className="bg-purple-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-purple-700 transition-colors">
              अभी खरीदें
            </Link>
          </div>
        </div>
      </section>

      {/* श्रेणियां सेक्शन */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">श्रेणियां</h2>
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

      {/* फीचर्ड प्रोडक्ट्स सेक्शन */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">फीचर्ड प्रोडक्ट्स</h2>
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
          <div className="text-center mt-12">
            <Link href="/products" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors">
              सभी प्रोडक्ट्स देखें
            </Link>
          </div>
        </div>
      </section>

      {/* न्यूजलेटर सेक्शन */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">हमारे न्यूजलेटर से जुड़ें</h2>
          <p className="text-lg mb-8">नए प्रोडक्ट्स और ऑफर्स के बारे में जानकारी प्राप्त करें</p>
          <form className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="आपका ईमेल एड्रेस" 
              className="flex-grow px-4 py-3 rounded-l-md text-gray-900 focus:outline-none"
              required
            />
            <button 
              type="submit" 
              className="bg-gray-900 px-6 py-3 rounded-r-md font-medium hover:bg-gray-800 transition-colors"
            >
              सब्सक्राइब
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
