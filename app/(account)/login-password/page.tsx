"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, signIn, refreshSession } = useAuth();

  const email = searchParams.get('email') || '';
  const redirectTo = searchParams.get('redirectedFrom') || '/home';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [captchaSvg, setCaptchaSvg] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaText, setCaptchaText] = useState<string>('');

  useEffect(() => {
    if (session) router.push('/home');
  }, [session, router]);

  useEffect(() => {
    if (!email) router.push('/login');
  }, [email, router]);

  const loadCaptcha = async () => {
    try {
      const res = await fetch('/api/captcha', { cache: 'no-store' });
      const data = await res.json();
      setCaptchaSvg(data.svg);
      setCaptchaToken(data.token);
      setCaptchaText('');
    } catch (e) {
      console.error('Failed to load captcha', e);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!email) throw new Error('Email is required');
      if (!password) throw new Error('Password is required');
      if (!captchaText || !captchaToken) throw new Error('Please solve the CAPTCHA');

      const { error, data } = await signIn(email, password, undefined, captchaText, captchaToken);
      if (error) {
        throw new Error(typeof error === 'string' ? error : 'Invalid email or password');
      }

      if (data?.requiresOtp) {
        setSuccess('OTP sent to your email. Please login using OTP option.');
        router.push(`/login-otp?email=${encodeURIComponent(email)}&redirectedFrom=${encodeURIComponent(redirectTo)}`);
        return;
      }

      await refreshSession();

      const role = data?.user?.role || 'user';
      if (role === 'admin') router.push('/admin/dashboard'); else router.push(redirectTo);
    } catch (err: unknown) {
      console.error('Password login error:', err);
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      if (msg.toLowerCase().includes('captcha')) {
        setError('Invalid CAPTCHA. Please try again.');
        loadCaptcha();
        setCaptchaText('');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 dark:text-gray-100 transform transition-all duration-500 hover:shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Login with Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {email}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-800/60 backdrop-blur-sm pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPassword(!showPassword);
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">Enter the numbers</label>
                <button type="button" onClick={loadCaptcha} className="text-xs text-blue-600 hover:underline">Refresh</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-white/60 dark:bg-gray-800/60" dangerouslySetInnerHTML={{ __html: captchaSvg || '' }} />
                <input
                  id="captcha"
                  name="captcha"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  required
                  className="flex-1 appearance-none relative block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-800/60 backdrop-blur-sm"
                  placeholder="Type numbers"
                  title="Enter exactly 5 digits"
                  value={captchaText}
                  onChange={(e) => setCaptchaText(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center py-3 px-4 border-0 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login Password'}
          </button>

          <button
            type="button"
            onClick={() => router.push(`/login?reset=1`)}
            className="w-full py-2 text-sm text-gray-700 dark:text-gray-300 hover:underline"
          >
            Use a different email
          </button>
        </form>
      </div>
    </div>
  );
}
