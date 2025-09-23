"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface WishItem {
  product_id: string;
  created_at: string;
}

export default function WishlistPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<WishItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) router.push('/login');
  }, [loading, session, router]);

  const load = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const resp = await fetch('/api/wishlist', { cache: 'no-store' });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to load wishlist');
      setItems(data.wishlist || []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load wishlist';
      setError(msg);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = async (product_id: string) => {
    try {
      const resp = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed');
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow sm:rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
          <button onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Back</button>
        </div>
        {error && <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{error}</div>}
        {loadingList ? (
          <div className="text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500">Your wishlist is empty.</div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.product_id} className="border rounded p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Product #{it.product_id}</div>
                  <div className="text-sm text-gray-500">Added: {new Date(it.created_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => router.push(`/products/${it.product_id}`)} className="px-3 py-1.5 text-sm rounded bg-purple-600 text-white hover:bg-purple-700">View</button>
                  <button onClick={() => toggle(it.product_id)} className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
