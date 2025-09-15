'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PhoneVerification() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', isError: false });

    try {
      // Simple validation
      if (!phone) {
        throw new Error('Phone number is required');
      }
      
      // Here you would typically make an API call to verify the phone number
      // For now, we'll just simulate a successful verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ text: 'Phone number verified successfully!', isError: false });
      // Redirect to profile after successful verification
      router.push('/profile');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify phone number. Please try again.';
      setMessage({ 
        text: errorMessage, 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Enter Your Phone Number
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We&apos;ll use this to verify your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message.text && (
            <div className={`mb-4 p-3 rounded-md ${message.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message.text}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">+91</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Phone Number'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
