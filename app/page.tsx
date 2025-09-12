import Link from "next/link";
import ProductCard from "./components/ProductCard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Dummy product data
const featuredProducts = [
  {
    id: "1",
    name: "Men's Shirt",
    price: 899,
    image: "https://placehold.co/400x600/2563eb/white?text=Shirt",
    category: "Men"
  },
  {
    id: "2",
    name: "Women's Saree",
    price: 1499,
    image: "https://placehold.co/400x600/7c3aed/white?text=Saree",
    category: "Women"
  },
  {
    id: "3",
    name: "Kids Suit",
    price: 699,
    image: "https://placehold.co/400x600/10b981/white?text=Kids+Suit",
    category: "Kids"
  },
  {
    id: "4",
    name: "Jeans Pants",
    price: 999,
    image: "https://placehold.co/400x600/1e40af/white?text=Jeans",
    category: "Men"
  },
];

// Categories
const categories = [
  { name: "Men", image: "https://placehold.co/400x300/2563eb/white?text=Men", link: "/products?category=men" },
  { name: "Women", image: "https://placehold.co/400x300/7c3aed/white?text=Women", link: "/products?category=women" },
  { name: "Kids", image: "https://placehold.co/400x300/10b981/white?text=Kids", link: "/products?category=kids" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      {/* हीरो सेक्शन */}
      <section className="relative h-[70vh] bg-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to Ma Baba Cloth Store
            </h1>
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

      {/* श्रेणियां सेक्शन */}
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

      {/* फीचर्ड प्रोडक्ट्स सेक्शन */}
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
