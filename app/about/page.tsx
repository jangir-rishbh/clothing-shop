export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">हमारे बारे में</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4">मा बाबा क्लॉथ स्टोर का इतिहास</h2>
        <p className="text-gray-700 mb-4">
          मा बाबा क्लॉथ स्टोर की स्थापना 1995 में हुई थी। हमारी शुरुआत एक छोटी दुकान से हुई थी, लेकिन अब हम शहर के सबसे बड़े कपड़ा विक्रेताओं में से एक हैं।
        </p>
        <p className="text-gray-700 mb-4">
          हमारा मिशन अपने ग्राहकों को उच्च गुणवत्ता वाले कपड़े उचित कीमतों पर प्रदान करना है। हम हमेशा नवीनतम फैशन ट्रेंड्स के साथ अपडेट रहते हैं और अपने ग्राहकों को सर्वोत्तम सेवा प्रदान करने का प्रयास करते हैं।
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">हमारा मिशन</h2>
          <p className="text-gray-700">
            हमारा मिशन है हर व्यक्ति को उच्च गुणवत्ता वाले कपड़े उचित कीमतों पर उपलब्ध कराना। हम विश्वास करते हैं कि अच्छे कपड़े हर किसी के लिए सुलभ होने चाहिए।
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">हमारा विजन</h2>
          <p className="text-gray-700">
            हमारा विजन है कपड़ा उद्योग में अग्रणी बनना और अपने ग्राहकों को सर्वोत्तम शॉपिंग अनुभव प्रदान करना। हम नवाचार और ग्राहक संतुष्टि पर ध्यान केंद्रित करते हैं।
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4">हमारी टीम</h2>
        <p className="text-gray-700 mb-4">
          हमारी टीम अनुभवी और समर्पित पेशेवरों से बनी है जो आपको सर्वोत्तम सेवा प्रदान करने के लिए प्रतिबद्ध हैं। हमारे कर्मचारी हमारी सबसे बड़ी संपत्ति हैं।
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">राम कुमार</h3>
            <p className="text-gray-600">संस्थापक</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">सीता देवी</h3>
            <p className="text-gray-600">प्रबंधक</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="font-semibold">मोहन सिंह</h3>
            <p className="text-gray-600">विक्रय प्रमुख</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">हमसे जुड़ें</h2>
        <p className="text-gray-700 mb-4">
          हम हमेशा प्रतिभाशाली और उत्साही लोगों की तलाश में रहते हैं। यदि आप हमारी टीम का हिस्सा बनना चाहते हैं, तो हमें संपर्क करें।
        </p>
        <a href="/contact" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition-colors">
          संपर्क करें
        </a>
      </div>
    </div>
  );
}