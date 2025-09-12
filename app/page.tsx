import Link from "next/link";
import { redirect } from 'next/navigation';

export default function LandingPage() {
  // Redirect to /home by default
  redirect('/home');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-4xl text-center p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="font-serif italic">
            <span className="text-yellow-600">Ma Baba</span>
            <span className="text-gray-900"> Cloth Store</span>
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your most trusted clothing store in town
        </p>
        <div className="space-y-4">
          <Link 
            href="/home"
            className="inline-block w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-md text-lg font-medium transition-colors"
          >
            Enter Store
          </Link>
        </div>
      </div>
    </div>
  );
}
