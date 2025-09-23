"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Address = {
  id: string;
  label?: string | null;
  line1: string;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  is_default?: boolean | null;
};

export default function AddressesPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    label: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false,
  });

  useEffect(() => {
    if (!loading && !session) router.push('/login');
  }, [loading, session, router]);

  const load = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const resp = await fetch('/api/addresses', { cache: 'no-store' });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to load addresses');
      setAddresses(data.addresses || []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load addresses';
      setError(msg);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      const resp = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to add address');
      setForm({ label: '', line1: '', line2: '', city: '', state: '', pincode: '', is_default: false });
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to add address';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    setSaving(true);
    try {
      const resp = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || 'Failed to delete');
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow sm:rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Addresses</h1>
          <button onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Back</button>
        </div>

        {error && <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{error}</div>}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input className="border rounded p-2" placeholder="Label (Home/Office)" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} />
          <input className="border rounded p-2" placeholder="Address line 1" value={form.line1} onChange={e => setForm({ ...form, line1: e.target.value })} />
          <input className="border rounded p-2" placeholder="Address line 2" value={form.line2} onChange={e => setForm({ ...form, line2: e.target.value })} />
          <input className="border rounded p-2" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          <input className="border rounded p-2" placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
          <input className="border rounded p-2" placeholder="Pincode" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} />
          <label className="flex items-center gap-2 text-sm mt-1">
            <input type="checkbox" checked={form.is_default} onChange={e => setForm({ ...form, is_default: e.target.checked })} />
            Set as default
          </label>
        </div>
        <div className="flex justify-end mt-4">
          <button disabled={saving} onClick={submit} className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}>{saving ? 'Saving...' : 'Add Address'}</button>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Saved Addresses</h2>
        {loadingList ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-3">
            {addresses.length === 0 && <div className="text-gray-500">No addresses yet.</div>}
            {addresses.map(a => (
              <div key={a.id} className="border rounded p-3 flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">{a.label || 'Address'}</div>
                  <div className="font-medium text-gray-900">{a.line1}</div>
                  {a.line2 && <div className="text-gray-700">{a.line2}</div>}
                  <div className="text-gray-700">{[a.city, a.state, a.pincode].filter(Boolean).join(', ')}</div>
                  {a.is_default ? <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Default</span> : null}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => remove(a.id)} className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
