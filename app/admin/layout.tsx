import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserFromCookie } from '@/lib/auth';
import AdminClientWrapper from './admin-client-wrapper';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUserFromCookie();
  if (!user || user.role !== 'admin') {
    redirect('/login?redirectedFrom=/admin/dashboard');
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/massage", label: "Massage" }
  ];

  return <AdminClientWrapper navItems={navItems}>{children}</AdminClientWrapper>;
}
