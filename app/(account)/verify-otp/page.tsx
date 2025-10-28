'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const verificationMethod = searchParams.get('method') || 'email'; // 'email' or 'phone'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
      setError(null);
      
      // Only auto-submit if we have exactly 6 digits and identifier is present
      if (value.length === 6 && (email || phone)) {
        // Add a longer delay to ensure state is updated before submission
        setTimeout(() => {
          handleSubmit(e as React.FormEvent);
        }, 300);
      }
    }
  };

  // Handle paste event for OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    if (pastedData) {
      const validOtp = pastedData.substring(0, 6);
      setOtp(validOtp);
      setError(null);
      
      // Only auto-submit if we have exactly 6 digits and identifier is present
      if (validOtp.length === 6 && (email || phone)) {
        // Add a longer delay to ensure state is updated before submission
        setTimeout(() => {
          handleSubmit(e as React.FormEvent);
        }, 300);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    // Get the pending user data from session storage
    const pendingUser = JSON.parse(sessionStorage.getItem('pendingUser') || '{}');
    const verificationMethod = pendingUser.verificationMethod || 'email';

    try {
      let response;
      
      if (verificationMethod === 'email') {
        response = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: pendingUser.email, 
            otp,
            type: 'signup_verification'
          })
        });
      } else {
        // For phone verification
        response = await fetch('/api/phone-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phone: `+91${pendingUser.mobile}`,
            otp,
            action: 'verify'
          })
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      // If this is a signup flow, and we already have password from the signup step, complete signup automatically
      if (pendingUser && pendingUser.name) {
        if (pendingUser.password) {
          await completeSignup(pendingUser.password);
        } else {
          setShowPasswordForm(true);
          setSuccess('OTP verified! Please set your password.');
        }
      } else {
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (error: Error | unknown) {
      const err = error as Error;
      console.error('OTP verification error:', error);
      setError(err.message || 'An error occurred while verifying your OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Complete the signup using collected user data and a password
  const completeSignup = async (passwordToUse: string) => {
    setLoading(true);
    setError(null);
    try {
      const pendingUser = JSON.parse(sessionStorage.getItem('pendingUser') || '{}');
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingUser.email,
          name: pendingUser.name,
          mobile: pendingUser.mobile,
          gender: pendingUser.gender,
          state: pendingUser.state,
          password: passwordToUse,
          otp: otp
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      setVerificationComplete(true);
      setSuccess('Account created successfully! Redirecting to login...');
      sessionStorage.removeItem('pendingUser');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: Error | unknown) {
      const err = error as Error;
      console.error('Error creating account:', error);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setResendDisabled(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Get the pending user data from session storage
      const pendingUser = JSON.parse(sessionStorage.getItem('pendingUser') || '{}');
      const verificationMethod = pendingUser.verificationMethod || 'email';
      
      let response;
      
      if (verificationMethod === 'email') {
        response = await fetch('/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: pendingUser.email,
            name: pendingUser.name,
            purpose: 'resend_verification' 
          })
        });
      } else {
        // For phone verification
        response = await fetch('/api/phone-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phone: `+91${pendingUser.mobile}`,
            action: 'send'
          })
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }
      
      // Start countdown for resend
      setResendCountdown(60);
      
      const countdownInterval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setSuccess('A new OTP has been sent to your email.');
    } catch (error: Error | unknown) {
      const err = error as Error;
      console.error('Error resending OTP:', error);
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Render the component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            {showPasswordForm ? 'Set Your Password' : 'Verify OTP'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {verificationMethod === 'email' 
              ? `Enter the 6-digit code sent to ${email}`
              : `Enter the 6-digit code sent to +91${phone}`}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-4">
            <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
          </div>
        )}

        {!verificationComplete && !showPasswordForm ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter 6-digit OTP
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={handleOtpChange}
                  onPaste={handlePaste}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="000000"
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading || otp.length !== 6
                    ? 'bg-indigo-400 dark:bg-indigo-700 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className={`font-medium ${
                  resendDisabled
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
                }`}
              >
                {resendDisabled ? `Resend OTP in ${resendCountdown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        ) : showPasswordForm && !verificationComplete ? (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (password === confirmPassword) {
                completeSignup(password);
              } else {
                setError('Passwords do not match');
              }
            }} 
            className="space-y-5"
          >
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white pr-10"
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white pr-10"
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading || !password || !confirmPassword
                    ? 'bg-indigo-400 dark:bg-indigo-700 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        ) : null}

        {verificationComplete && (
          <div className="mt-4 text-center">
            <p className="text-green-600 dark:text-green-400">
              Account created successfully! Redirecting to login...
            </p>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}