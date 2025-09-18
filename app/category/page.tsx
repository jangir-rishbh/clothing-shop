export default function CategoryPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Categories</h1>
        <p className="mt-2 text-gray-600">Browse our collection by category. This is a placeholder page — customize it as you like.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Men", "Women", "Kids", "Accessories", "Footwear", "Sale"].map((cat) => (
            <div
              key={cat}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">{cat}</h2>
              <p className="mt-1 text-sm text-gray-600">Explore {cat} collection</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
