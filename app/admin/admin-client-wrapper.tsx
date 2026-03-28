'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const AdminClientLayout = dynamic(() => import('./admin-client-layout'), {
  ssr: false,
});

interface AdminClientWrapperProps {
  children: ReactNode;
  navItems: {
    href: string;
    label: string;
  }[];
  user: {
    id: string;
    email: string;
    name?: string | null;
    mobile?: string | null;
    gender?: string | null;
    state?: string | null;
    role: 'admin' | 'user';
    two_factor_enabled?: boolean;
  };
}

export default function AdminClientWrapper({ children, navItems, user }: AdminClientWrapperProps) {
  return <AdminClientLayout navItems={navItems} user={user}>{children}</AdminClientLayout>;
}