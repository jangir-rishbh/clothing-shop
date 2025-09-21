'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { session, loading, refreshSession } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [userState, setUserState] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
    }
    if (session) {
      setTwoFactorEnabled(session.two_factor_enabled || false);
      setName(session.name || '');
      setMobile(session.mobile || '');
      setGender(session.gender || null);
      setUserState(session.state || null);
    }
  }, [session, loading, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleTwoFactorToggle = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          two_factor_enabled: !twoFactorEnabled,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.error || 'Update failed');
      }
      setTwoFactorEnabled(!twoFactorEnabled);
      setSuccess(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully`);
      // Refresh session data to show updated information
      await refreshSession();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name?.trim() || '',
          mobile: mobile?.trim() || null,
          gender: gender || null,
          state: userState || null,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.error || 'Update failed');
      }
      setSuccess('Profile updated successfully');
      await refreshSession();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update profile';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your account security and preferences</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Security Settings</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage your account security and authentication settings.
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{error}</div>
            )}
            {success && (
              <div className="mb-4 rounded bg-green-50 text-green-700 p-3">{success}</div>
            )}

            <div className="space-y-6">
              {/* Profile Details Form */}
              <div className="p-4 border border-gray-200 rounded-lg bg-white">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Profile Details</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      value={gender || ''}
                      onChange={(e) => setGender(e.target.value || null)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      value={userState || ''}
                      onChange={(e) => setUserState(e.target.value || null)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Your state"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
              {/* Two-Factor Authentication Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Add an extra layer of security to your account with email verification.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Status: <span className={`font-medium ${twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}>
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={handleTwoFactorToggle}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      twoFactorEnabled ? 'bg-purple-600' : 'bg-gray-200'
                    } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Account Information Display */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Account Information</h4>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{session.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{session.role || 'User'}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Back
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
