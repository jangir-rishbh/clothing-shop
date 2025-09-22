import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-6">
              <div className="text-4xl md:text-5xl font-serif font-black text-white mb-2">
                <span className="relative">
                  <span className="text-yellow-400 drop-shadow-lg">Ma</span> <span className="text-white drop-shadow-lg">Baba</span>
                </span>
              </div>
              <div className="text-sm font-sans font-semibold tracking-widest text-gray-100 uppercase">Elegant Clothing & Fashion</div>
              <div className="w-16 h-0.5 bg-yellow-400 mt-3 mb-4"></div>
            </div>
            <p className="text-gray-300">
              We have all types of clothing available. We guarantee quality and affordable prices.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-gray-300">Post office gadli, Gadli</p>
            <p className="text-gray-300">District - Jhunjhunu</p>
            <p className="text-gray-300">State - Rajasthan, PIN - 333033</p>
            <p className="text-gray-300">
              <a href="tel:+918696790758" className="hover:text-white">
                Phone: +91 86967 90758
              </a>
            </p>
            <p className="text-gray-300">
              <a href="mailto:manishjangir348@gmail.com" className="hover:text-white">
                Email: manishjangir348@gmail.com
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">&copy; {new Date().getFullYear()} 
            <span className="font-serif italic">
              <span className="text-yellow-400">Ma Baba</span>
              <span className="text-white"> Cloth Store</span>
            </span>. All rights reserved.
          </p>
          <p className="text-gray-400 mt-2">made by rishbh jangir</p>
        </div>
      </div>
    </footer>
  );
}