"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type FormData = {
  email: string;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
  });
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    if (session) {
      router.push('/home');
    }
  }, [session, router]);

  // Check for redirect URL
  const redirectTo = searchParams.get('redirectedFrom') || '/home';

  const reset = searchParams.get('reset') === '1';
  
  // Check if user was redirected due to being banned
  useEffect(() => {
    if (searchParams.get('banned') === 'true') {
      setError('Your account has been banned. Please contact support for assistance.');
    }
  }, [searchParams]);

  // Allow user to change email
  useEffect(() => {
    if (reset) {
      setEmailChecked(false);
      setEmailExists(null);
      setError(null);
      setSuccess(null);
      setFormData({ email: '' });
    }
  }, [reset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckEmail = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setEmailChecked(false);
    setEmailExists(null);

    try {
      if (!formData.email) {
        throw new Error('Email is required');
      }

      const res = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to check email');
      }

      if (data?.banned) {
        setEmailChecked(true);
        setEmailExists(true);
        setError('Your account has been banned. Please contact support for assistance.');
        return;
      }

      if (!data?.exists) {
        router.push(`/signup?email=${encodeURIComponent(formData.email)}`);
        return;
      }

      setEmailChecked(true);
      setEmailExists(true);
      setSuccess('Account found. Choose a login method.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordRoute = () => {
    router.push(`/login-password?email=${encodeURIComponent(formData.email)}&redirectedFrom=${encodeURIComponent(redirectTo)}`);
  };

  const handleOtpRoute = () => {
    router.push(`/login-otp?email=${encodeURIComponent(formData.email)}&redirectedFrom=${encodeURIComponent(redirectTo)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 dark:text-gray-100 transform transition-all duration-500 hover:shadow-2xl">
        <div>
          <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Sign in / Sign up
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Enter your email to continue
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">{success}</p>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!emailChecked) handleCheckEmail();
          }}
          className="mt-8 space-y-6"
        >
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            {!emailChecked && (
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-800/60 backdrop-blur-sm mb-4"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            {emailChecked && emailExists === true && (
              <div className="mb-4">
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handlePasswordRoute}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-lg font-semibold border-0 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Login with Password
                  </button>
                  <button
                    type="button"
                    onClick={handleOtpRoute}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-lg font-semibold border-0 transition-all bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Login with OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/login?reset=1')}
                    className="w-full py-2 text-sm text-gray-700 dark:text-gray-300 hover:underline"
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600">
            We will check if your email is registered.
          </p>

          <div className="space-y-4">
            {!emailChecked ? (
              <button
                type="button"
                onClick={handleCheckEmail}
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border-0 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Checking...' : 'Check Email'}
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
