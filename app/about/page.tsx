export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center py-12 md:py-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">Crafting Fashion, Weaving Dreams Since 1995</p>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Journey</h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Established in 1995, Ma Baba Cloth Store began as a humble shop with a simple vision: to bring quality textiles to our community. 
                What started as a small family business has blossomed into one of the most trusted names in the textile industry.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Over the years, we&apos;ve grown, but our commitment to quality and customer satisfaction has never wavered. 
                We take pride in offering the finest fabrics, latest designs, and exceptional service to all our customers.
              </p>
            </div>
            <div className="hidden md:block md:w-1/2 bg-cover bg-center" 
                 style={{backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"}}>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
            <div className="p-8 text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-purple-100 leading-relaxed">
                To make high-quality, fashionable clothing accessible to everyone. We believe that great style shouldn&apos;t come at a premium, 
                and everyone deserves to look and feel their best without breaking the bank.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
            <div className="p-8 text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-pink-100 leading-relaxed">
                To redefine the fashion retail experience by combining traditional values with modern innovation. 
                We envision becoming the most trusted and loved fashion destination, known for quality, style, and exceptional customer service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Meet Our Team</h2>
            <p className="mt-4 text-xl text-gray-600">The passionate people behind our success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Owner */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
              <div className="h-64 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                <svg className="h-32 w-32 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900">Durga Devi</h3>
                <p className="text-purple-600 font-medium">Owner & Manager</p>
                <p className="mt-2 text-gray-600">Handling sales, customer service, and store operations</p>
              </div>
            </div>

            {/* Stock Manager */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
              <div className="h-64 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                <svg className="h-32 w-32 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900">Munesh Kumar</h3>
                <p className="text-green-600 font-medium">Stock & Inventory</p>
                <p className="mt-2 text-gray-600">Managing inventory, stock, and product procurement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Visit Our Store</h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            We&apos;re a small, dedicated team passionate about bringing you the best in fashion. Visit us to experience personalized service and quality products.
          </p>
          <a href="/contact" className="inline-block bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}