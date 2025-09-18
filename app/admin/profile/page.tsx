'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    gender: '',
    state: '',
  });

  useEffect(() => {
    const init = async () => {
      try {
        const resp = await fetch('/api/me', { cache: 'no-store' });
        const data = await resp.json();
        if (!data?.user) {
          router.push('/login?redirectedFrom=/admin/profile');
          return;
        }
        if (data.user.role !== 'admin') {
          router.push('/login?redirectedFrom=/admin/profile');
          return;
        }
        setForm({
          name: data.user.name || '',
          mobile: data.user.mobile || '',
          gender: data.user.gender || '',
          state: data.user.state || '',
        });
      } catch (e) {
        console.error(e);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch('/api/admin/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: form.mobile.trim() || null,
          gender: form.gender.trim() || null,
          state: form.state.trim() || null,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.error || 'Update failed');
      }
      setSuccess('Profile updated successfully');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      {error && (
        <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded bg-green-50 text-green-700 p-3">{success}</div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Your state"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded text-white ${saving ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
