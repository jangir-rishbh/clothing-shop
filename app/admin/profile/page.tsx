'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminProfilePage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!session || session.role !== 'admin')) {
      router.push('/login');
    }
  }, [session, loading, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Profile</h1>
          <p className="mt-2 text-sm text-gray-600">Administrator account details and information</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Information</h3>
            <Link
              href="/admin/profile/update"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              Update Profile
            </Link>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{session.name || 'Admin'}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{session.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-gray-100">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">
                    {session.role || 'Admin'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Actions</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/admin/dashboard"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium text-gray-900">Dashboard</h4>
                <p className="mt-1 text-sm text-gray-500">View admin dashboard and analytics</p>
              </Link>
              <Link
                href="/admin/users"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium text-gray-900">Manage Users</h4>
                <p className="mt-1 text-sm text-gray-500">View and manage user accounts</p>
              </Link>
              <Link
                href="/admin/products"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium text-gray-900">Products</h4>
                <p className="mt-1 text-sm text-gray-500">Manage product catalog</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
