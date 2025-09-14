"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

type FormData = {
  email: string;
  password: string;
  name: string;
  otp: string;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp, session } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
    otp: ''
  });
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  }, [session, router]);

  // Check for redirect URL
  const redirectTo = searchParams.get('redirectedFrom') || '/home';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.email) {
        throw new Error('Email is required');
      }

      // Send OTP to email
      console.log('Sending OTP request for email:', formData.email);
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      console.log('OTP response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setShowOtpField(true);
      setOtpSent(true);
      setSuccess('OTP has been sent to your email');
    } catch (error: unknown) {
      console.error('Error in handleSendOtp:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        // Sign in
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        router.push(redirectTo);
      } else {
        if (!otpSent) {
          await handleSendOtp(e);
          return;
        }

        // Verify OTP before proceeding with signup
        console.log('Verifying OTP for email:', formData.email);
        const verifyResponse = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
          }),
        });

        const verifyData = await verifyResponse.json();
        console.log('OTP verification response:', { status: verifyResponse.status, data: verifyData });

        if (!verifyResponse.ok) {
          // Handle specific OTP error cases
          if (verifyData.code === 'INVALID_OTP') {
            throw new Error('The OTP you entered is incorrect. Please try again.');
          } else if (verifyResponse.status === 404) {
            throw new Error('No active OTP found. Please request a new OTP.');
          } else {
            throw new Error(verifyData.error || 'Failed to verify OTP. Please try again.');
          }
        }

        // OTP verified, proceed with signup
        if (!formData.name.trim()) {
          throw new Error('Name is required');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        
        const { error } = await signUp(formData.email, formData.password, formData.name.trim());
        if (error) throw error;
        
        setSuccess('Registration successful! Please log in.');
        setIsLogin(true);
        setFormData(prev => ({ ...prev, password: '', otp: '' }));
        setShowOtpField(false);
        setOtpSent(false);
      }
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      if (errorMessage.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('Please verify your email before logging in');
      } else if (errorMessage.includes('already registered')) {
        setError('This email is already registered. Please log in instead.');
        setIsLogin(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccess(null);
              }}
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={otpSent}
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                disabled={otpSent}
              />
            </div>
            {!isLogin && showOtpField && (
              <div>
                <label htmlFor="otp" className="sr-only">OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                />
              </div>
            )}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={!isLogin && !otpSent}
              />
            </div>
          </div>

          {isLogin ? (
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
          ) : !otpSent ? (
            <p className="text-sm text-gray-600">
              We&apos;ll send you a verification code to your email.
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Enter the 6-digit OTP sent to {formData.email}
            </p>
          )}

          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span>Processing...</span>
              ) : isLogin ? (
                'Sign in'
              ) : otpSent ? (
                'Complete Sign Up'
              ) : (
                'Send OTP'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
