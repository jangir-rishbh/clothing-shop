"use client";

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    privacyPolicy: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.privacyPolicy) {
      setSubmitStatus({
        success: false,
        message: 'Please accept the privacy policy to continue.'
      });
      // Scroll to the privacy policy checkbox
      document.getElementById('privacyPolicy')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitStatus({
        success: true,
        message: data.message || 'Thank you for your message! We will get back to you soon.'
      });
      
      // Reset form on success
      if (data.success) {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          privacyPolicy: false
        });
        
        // Scroll to the success message
        setTimeout(() => {
          const successElement = document.getElementById('form-status');
          if (successElement) {
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again later.'
      });
      
      // Scroll to the error message
      setTimeout(() => {
        const errorElement = document.getElementById('form-status');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block transform transition-all duration-500 hover:scale-105">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
              Get in Touch
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-pink-500 mx-auto my-6 rounded-full"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mt-6 font-light">
              We&apos;re here to help and answer any questions you might have. 
              <span className="block mt-2 text-yellow-300">Let&apos;s start a conversation!</span>
            </p>
          </div>
        </div>
        
        {/* Contact Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Phone Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-l-4 border-purple-600">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Call Us</h3>
            <p className="text-gray-600 text-center mb-4">Speak with our team</p>
            <a href="tel:+918696790758" className="block text-center text-purple-600 hover:text-purple-800 text-lg font-medium transition-colors">
              +91 86967 90758
            </a>
          </div>
          
          {/* Email Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-l-4 border-blue-500">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Email Us</h3>
            <p className="text-gray-600 text-center mb-4">Send us a message</p>
            <a href="mailto:manishjangir348@gmail.com" className="block text-center text-blue-600 hover:text-blue-800 text-lg font-medium transition-colors">
              manishjangir348@gmail.com
            </a>
          </div>
          
          {/* Location Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-l-4 border-indigo-500">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Visit Us</h3>
            <p className="text-gray-600 text-center mb-4">Come say hello</p>
            <div className="text-center text-gray-700">
              <p>Post office gadli, Gadli</p>
              <p>District - Jhunjhunu</p>
              <p>State - Rajasthan, PIN - 333033</p>
            </div>
          </div>
        </div>
        
        {/* Contact Form Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Contact Info */}
            <div className="md:w-2/5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-12">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-purple-100 mb-8">Fill up the form and our team will get back to you within 24 hours.</p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-white/20 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Call Us</h4>
                    <p className="text-purple-100">+91 86967 90758</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Email Us</h4>
                    <p className="text-purple-100">manishjangir348@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-purple-100">Post office gadli, Gadli</p>
                    <p className="text-purple-100">District - Jhunjhunu</p>
                    <p className="text-purple-100">State - Rajasthan, PIN - 333033</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Right Side - Contact Form */}
            <div className="md:w-3/5 p-12">
              <div className="mb-10 text-center">
                <div className="inline-block relative">
                  <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-3">
                    Send us a message
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </h2>
                  <p className="text-lg text-gray-300 mt-3">
                    We&apos;re excited to hear from you! 
                    <span className="block text-yellow-300 font-medium">Let&apos;s start a conversation.</span>
                  </p>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"></div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/10 transform transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/30 group">
                {/* Decorative elements */}
                <div className="absolute top-0 -right-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -left-10 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-10 left-1/2 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-1 ml-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-300 transition-all duration-300 group-hover:border-yellow-300"
                        placeholder="John"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent group-hover:border-yellow-400/20 transition-all duration-300"></div>
                    </div>
                    <div className="relative group">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-1 ml-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-300 transition-all duration-300 group-hover:border-yellow-300"
                        placeholder="Doe"
                        required
                      />
                      <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent group-hover:border-yellow-400/20 transition-all duration-300"></div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1 ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-300 transition-all duration-300 group-hover:border-yellow-300"
                      placeholder="your@email.com"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent group-hover:border-yellow-400/20 transition-all duration-300"></div>
                  </div>
                  
                  <div className="relative group">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-300 transition-all duration-300 group-hover:border-yellow-300"
                      placeholder="+1 (555) 123-4567"
                    />
                    <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent group-hover:border-yellow-400/20 transition-all duration-300"></div>
                  </div>
                  
                  <div className="mt-6 relative group">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1 ml-1">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white rounded-xl border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-300 transition-all duration-300 group-hover:border-yellow-300"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                    <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent group-hover:border-yellow-400/20 transition-all duration-300"></div>
                  </div>
                  
                  <div className="mt-8 flex items-start">
                    <div className="flex items-center h-5">
                      <div className="relative flex items-center">
                        <input
                          id="privacyPolicy"
                          name="privacyPolicy"
                          type="checkbox"
                          checked={formData.privacyPolicy}
                          onChange={handleChange}
                          className="h-5 w-5 rounded border-gray-600 bg-white/5 text-yellow-400 focus:ring-yellow-500/50 focus:ring-offset-0 focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer"
                          required
                        />
                        <svg 
                          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-yellow-400 pointer-events-none transition-opacity duration-200 ${formData.privacyPolicy ? 'opacity-100' : 'opacity-0'}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="privacyPolicy" className="font-medium text-gray-300 cursor-pointer">
                        I agree to the{' '}
                        <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 font-semibold">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-10 relative group">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center items-center py-4 px-8 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-indigo-900 transition-all duration-400 transform hover:scale-[1.02] shadow-lg hover:shadow-yellow-500/20 ${
                        isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">Send Message</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </>
                      )}
                    </button>
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-xl opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-300"></div>
                  </div>
                  
                  {submitStatus && (
                    <div 
                      id="form-status"
                      className={`mt-6 p-4 rounded-xl border-l-4 ${
                        submitStatus.success 
                          ? 'bg-green-500/10 border-green-400 text-green-200' 
                          : 'bg-red-500/10 border-red-400 text-red-200'
                      } backdrop-blur-sm transform transition-all duration-300 animate-fade-in`}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 ${submitStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                          {submitStatus.success ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">
                            {submitStatus.message}
                            {!submitStatus.success && (
                              <button 
                                onClick={() => setSubmitStatus(null)}
                                className="ml-2 text-xs bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition-colors"
                              >
                                Dismiss
                              </button>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Business Hours Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Business Hours</h2>
            <div className="w-20 h-0.5 bg-yellow-500 mx-auto my-4"></div>
          </div>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Business Hours</h2>
              </div>
            
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Monday - Saturday</span>
                    <span className="font-semibold text-indigo-600">9:00 AM - 9:00 PM</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Sunday</span>
                    <span className="font-semibold text-indigo-600">10:00 AM - 8:00 PM</span>
                  </div>
                </div>
                
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Need help urgently?</h3>
                  <p className="text-gray-600 mb-4">Call us anytime for immediate assistance</p>
                  <a href="tel:+919876543210" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Now
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-pink-100 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Follow Us</h2>
              </div>
              
              <p className="text-gray-600 mb-6">Visit our store to explore our exclusive collection and enjoy personalized assistance from our fashion experts.</p>
              
              <div className="flex space-x-4">
                <a href="#" className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.797v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="p-3 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-200 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="p-3 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="#" className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}