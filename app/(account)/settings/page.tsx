'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import type { Locale } from '@/context/I18nContext';

export default function SettingsPage() {
  const { session, loading, refreshSession, signOut } = useAuth();
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [userState, setUserState] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activeGroup, setActiveGroup] = useState<'profile' | 'security'>('profile');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');


  useEffect(() => {
    if (session) {
      setTwoFactorEnabled(session.two_factor_enabled || false);
      setName(session.name || '');
      setMobile(session.mobile || '');
      setGender(session.gender || null);
      setUserState(session.state || null);
    }
  }, [session, loading, router]);

  // Apply theme helper
  const applyTheme = (next: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      const el = document.documentElement;
      el.classList.remove('light', 'dark');
      el.classList.add(next);
    }
    try { localStorage.setItem('theme', next); } catch {}
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/home');
    } catch (e) {
      console.error('Error signing out:', e);
    }
  };

  // Load theme from preferences or localStorage
  useEffect(() => {
    // Prefer localStorage immediately for snappy UI
    try {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
        applyTheme(stored);
      }
    } catch {}

    // If authenticated, fetch server preferences
    (async () => {
      if (loading || !session) return;
      try {
        const resp = await fetch('/api/preferences', { cache: 'no-store' });
        const data = await resp.json();
        const prefTheme = data?.preferences?.theme as 'light' | 'dark' | null;
        if (prefTheme === 'light' || prefTheme === 'dark') {
          setTheme(prefTheme);
          applyTheme(prefTheme);
        }
      } catch {}
    })();
  }, [loading, session]);

  const handleThemeChange = async (next: 'light' | 'dark') => {
    setTheme(next);
    applyTheme(next);
    // Persist to server preferences (best-effort) only if authenticated
    if (session) {
      try {
        await fetch('/api/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: next })
        });
      } catch {}
    }
  };

  if (loading) {
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

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.');
    if (!confirmed) return;
    setDeleting(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch('/api/delete-account', { method: 'POST' });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data?.error || 'Failed to delete account');
      }
      // ensure local storage and context are cleared
      try { await signOut(); } catch {}
      // redirect to login (user can create a new account from there)
      router.push('/login');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to delete account';
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">{t('settings')}</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your account security and preferences</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{t('settings')}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {session ? 'Manage your account security and preferences.' : 'Customize your preferences.'}
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
              {/* Language Preference (available to all) */}
              <div className="p-4 border border-gray-200 rounded-lg bg-white">
                <h4 className="text-lg font-medium text-gray-900 mb-2">{t('language')}</h4>
                <p className="text-sm text-gray-600 mb-4">Choose your preferred website language.</p>
                <div className="flex items-center gap-3">
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as Locale)}
                    className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    aria-label={t('language')}
                  >
                    <option value="en">{t('english')}</option>
                    <option value="hi">{t('hindi')}</option>
                  </select>
                </div>

                {/* Theme Preference (available to all) */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Theme</h4>
                  <p className="text-sm text-gray-600 mb-4">Switch between Light and Dark mode.</p>
                  <div className="flex items-center gap-3">
                    <select
                      value={theme}
                      onChange={(e) => handleThemeChange((e.target.value as 'light' | 'dark'))}
                      className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      aria-label="Theme"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
              </div>

              {session && (
                <>
                  {/* Authenticated-only sections */}
                  {/* Group Switcher */}
                  <div className="mt-6">
                    <div className="inline-flex rounded-md shadow-sm" role="group" aria-label="Settings groups">
                      <button
                        type="button"
                        onClick={() => setActiveGroup('profile')}
                        className={`px-4 py-2 text-sm font-medium border rounded-l-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          activeGroup === 'profile' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveGroup('security')}
                        className={`px-4 py-2 text-sm font-medium border rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          activeGroup === 'security' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Security
                      </button>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <NotificationSection />

                  {/* Grouped Content */}
                  {activeGroup === 'profile' ? (
                    <>
                      {/* Profile */}
                      <h3 className="text-xl font-semibold text-gray-900">Profile</h3>
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
                    </>
                  ) : (
                    <>
                      {/* Account */}
                      <h3 className="text-xl font-semibold text-gray-900">Security</h3>
                      <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-4">
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

                        {/* Logout */}
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('logout')}</h4>
                          <p className="text-sm text-gray-600 mb-4">Sign out of your account on this device.</p>
                          <div className="flex justify-center">
                            <button
                              onClick={handleLogout}
                              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                            >
                              {t('logout')}
                            </button>
                          </div>
                        </div>

                        {/* Delete Account */}
                        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                          <h4 className="text-lg font-semibold text-red-800 mb-2">Delete Account</h4>
                          <p className="text-sm text-red-700 mb-4">Permanently delete your account and all associated data.</p>
                          <div className="flex justify-center">
                            <button
                              onClick={handleDeleteAccount}
                              disabled={deleting}
                              className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {deleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={() => router.back()}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      {t('back')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lightweight client component for Notifications
function NotificationSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email_offers, setEmailOffers] = useState(true);
  const [email_orders, setEmailOrders] = useState(true);
  const [sms_updates, setSmsUpdates] = useState(false);
  const [whatsapp_updates, setWhatsappUpdates] = useState(false);
  const [push_enabled, setPushEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/api/notifications', { cache: 'no-store' });
        const data = await resp.json();
        const n = data?.notifications;
        if (n) {
          setEmailOffers(!!n.email_offers);
          setEmailOrders(!!n.email_orders);
          setSmsUpdates(!!n.sms_updates);
          setWhatsappUpdates(!!n.whatsapp_updates);
          setPushEnabled(!!n.push_enabled);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_offers, email_orders, sms_updates, whatsapp_updates, push_enabled })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to save notifications');
      setSuccess('Notification settings saved');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to save notifications';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h4>
      {error && <div className="mb-3 rounded bg-red-50 text-red-700 p-2 text-sm">{error}</div>}
      {success && <div className="mb-3 rounded bg-green-50 text-green-700 p-2 text-sm">{success}</div>}
      {loading ? (
        <div className="text-gray-500">Loading notification settings...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={email_offers} onChange={(e) => setEmailOffers(e.target.checked)} /> Email: Offers & Sales</label>
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={email_orders} onChange={(e) => setEmailOrders(e.target.checked)} /> Email: Order Updates</label>
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={sms_updates} onChange={(e) => setSmsUpdates(e.target.checked)} /> SMS Updates</label>
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={whatsapp_updates} onChange={(e) => setWhatsappUpdates(e.target.checked)} /> WhatsApp Updates</label>
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={push_enabled} onChange={(e) => setPushEnabled(e.target.checked)} /> Push Notifications</label>
          <div className="sm:col-span-2 flex justify-end">
            <button onClick={save} disabled={saving} className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}>{saving ? 'Saving...' : 'Save Notification Settings'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

