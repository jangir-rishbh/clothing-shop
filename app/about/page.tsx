export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">About Us</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4">History of Ma Baba Cloth Store</h2>
        <p className="text-gray-700 mb-4">
          Ma Baba Cloth Store was established in 1995. We started as a small shop, and now we are one of the largest textile retailers in the city.
        </p>
        <p className="text-gray-700 mb-4">
          Our mission is to provide our customers with high-quality clothing at reasonable prices. We always stay updated with the latest fashion trends and strive to provide the best service to our customers.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700">
            Our mission is to make high-quality clothing accessible to everyone at affordable prices. We believe that good clothes should be accessible to all.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-700">
            Our vision is to become a leader in the textile industry and provide our customers with the best shopping experience. We focus on innovation and customer satisfaction.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <p className="text-gray-700 mb-4">
          Our team consists of experienced and dedicated professionals committed to providing you with the best service. Our employees are our greatest asset.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">Ram Kumar</h3>
            <p className="text-gray-600">Founder</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">Sita Devi</h3>
            <p className="text-gray-600">Manager</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">Mohan Singh</h3>
            <p className="text-gray-600">Sales Head</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
        <p className="text-gray-700 mb-4">
          We are always looking for talented and enthusiastic people. If you would like to be part of our team, please contact us.
        </p>
        <a href="/contact" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors">
          Contact Us
        </a>
      </div>
    </div>
  );
}