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
}

export default function AdminClientWrapper({ children, navItems }: AdminClientWrapperProps) {
  return <AdminClientLayout navItems={navItems}>{children}</AdminClientLayout>;
}