import { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUserFromCookie } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUserFromCookie();
  if (!user || user.role !== 'admin') {
    redirect('/login?redirectedFrom=/admin/dashboard');
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="bg-gray-900 text-white p-6 space-y-4">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <nav className="space-y-2">
          <Link className="block hover:underline" href="/admin/dashboard">Dashboard</Link>
          <Link className="block hover:underline" href="/admin/profile">My Profile</Link>
          <Link className="block hover:underline" href="/admin/users">Users</Link>
          <Link className="block hover:underline" href="/admin/products">Products</Link>
        </nav>
      </aside>
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div />
          <Link href="/admin/profile" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
            Edit My Profile
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
