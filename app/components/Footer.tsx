import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">मा बाबा क्लॉथ स्टोर</h3>
            <p className="text-gray-300">
              हमारे पास सभी प्रकार के कपड़े उपलब्ध हैं। हम गुणवत्ता और सस्ती कीमतों की गारंटी देते हैं।
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">त्वरित लिंक्स</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">होम</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white">प्रोडक्ट्स</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white">हमारे बारे में</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">संपर्क करें</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">संपर्क करें</h3>
            <p className="text-gray-300">मेन रोड, आपका शहर</p>
            <p className="text-gray-300">फोन: 123-456-7890</p>
            <p className="text-gray-300">ईमेल: info@mababaclothstore.com</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300">&copy; {new Date().getFullYear()} मा बाबा क्लॉथ स्टोर। सर्वाधिकार सुरक्षित।</p>
        </div>
      </div>
    </footer>
  );
}