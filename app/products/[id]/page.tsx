import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/data/products";

type PageProps = {
  params: { id: string };
};

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const rating = product.rating ?? 4.0;
  const reviews = product.reviewsCount ?? 0;
  const colors = product.variants?.colors ?? [];
  const sizes = product.variants?.sizes ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-gray-600 mb-6">
          <ol className="list-reset flex">
            <li>
              <Link href="/home" className="hover:text-purple-600">Home</Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link href={`/products?category=${encodeURIComponent(product.category.toLowerCase())}`} className="hover:text-purple-600">
                {product.category}
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-gray-900 font-medium truncate max-w-[50vw] sm:max-w-none">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Image */}
          <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden min-h-[420px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={false}
            />
          </div>

          {/* Right: Info */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">{product.category}</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-500">({reviews})</span>
              </div>
            </div>

            <p className="mt-4 text-2xl font-bold text-gray-900">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}</p>

            {product.description && (
              <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>
            )}

            {/* Variants */}
            {colors.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">Color</h4>
                <div className="flex space-x-2 mt-2">
                  {colors.map((c) => (
                    <span key={c} className="w-8 h-8 rounded-full border-2 border-gray-200" title={c} style={{ backgroundColor: c === 'Black' ? '#000' : c === 'Blue' ? '#3B82F6' : c === 'Red' ? '#EF4444' : c === 'Green' ? '#10B981' : c === 'Gold' ? '#F59E0B' : undefined }} />
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">Size</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizes.map((s) => (
                    <span key={s} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Note: No online orders */}
            <div className="mt-8 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900">
              Online orders are not accepted. Please visit our store or contact us for purchases.
            </div>

            <div className="mt-6 flex gap-3">
              <Link href="/contact" className="px-5 py-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700">Contact Us</Link>
              <Link href="/category" className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Back to Categories</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
