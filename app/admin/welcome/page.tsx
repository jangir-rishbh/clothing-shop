'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminWelcomePage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!session || session.role !== 'admin')) {
      router.push('/login');
      return;
    }

    // Redirect to admin dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push('/admin/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [session, loading, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 0l6 6-6m-6 6v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2H9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome Admin!
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Hello <span className="font-semibold text-purple-600 dark:text-purple-400">{session.name || 'Admin'}</span>!
          </p>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
            Redirecting to admin dashboard...
          </p>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
