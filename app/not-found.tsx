import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">पेज नहीं मिला</h2>
        <p className="text-gray-600 mb-8">
          क्षमा करें! आप जिस पेज की तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है।
        </p>
        <Link 
          href="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          होम पर वापस जाएं
        </Link>
      </div>
    </div>
  );
}
