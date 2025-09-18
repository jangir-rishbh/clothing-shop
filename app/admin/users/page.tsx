"use client";

import { useEffect, useMemo, useState } from "react";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "user";
  mobile: string | null;
  gender: string | null;
  state: string | null;
  is_banned: boolean | null;
  created_at?: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch("/api/admin/users", { cache: "no-store" });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.error || "Failed to load users");
        setUsers(data.users || []);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load users";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.name || "").toLowerCase().includes(q) ||
        (u.mobile || "").toLowerCase().includes(q)
    );
  }, [search, users]);

  const setBusy = (id: string, val: boolean) =>
    setBusyIds((prev) => ({ ...prev, [id]: val }));

  const toggleBan = async (user: AdminUser) => {
    if (!user?.id) return;
    setBusy(user.id, true);
    try {
      const resp = await fetch("/api/admin/users/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ban: !user.is_banned }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Failed to update status");
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_banned: !user.is_banned } : u))
      );
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setBusy(user.id, false);
    }
  };

  const deleteUser = async (user: AdminUser) => {
    if (!user?.id) return;
    if (!confirm(`Delete user ${user.email}? This cannot be undone.`)) return;
    setBusy(user.id, true);
    try {
      const resp = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete user");
    } finally {
      setBusy(user.id, false);
    }
  };

  const changeRole = async (user: AdminUser, newRole: 'admin' | 'user') => {
    if (!user?.id) return;
    if (user.role === newRole) return;
    setBusy(user.id, true);
    try {
      const resp = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to change role');
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to change role');
    } finally {
      setBusy(user.id, false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <div className="flex items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-72"
          placeholder="Search by email, name, or mobile"
        />
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{error}</div>
      )}

      {loading ? (
        <div className="p-4">Loading users...</div>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full divide-y divide-gray-200 text-gray-900">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 text-gray-900">{u.email}</td>
                  <td className="px-4 py-2 text-gray-900">{u.name || "-"}</td>
                  <td className="px-4 py-2 text-gray-900">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u, e.target.value as 'admin' | 'user')}
                      disabled={!!busyIds[u.id]}
                      className="border rounded px-2 py-1 bg-white"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-gray-900">{u.mobile || "-"}</td>
                  <td className="px-4 py-2 text-gray-900">
                    {u.is_banned ? (
                      <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-700">Banned</span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => toggleBan(u)}
                        disabled={!!busyIds[u.id]}
                        className={`px-3 py-1 rounded text-white ${u.is_banned ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}`}
                      >
                        {u.is_banned ? "Unban" : "Ban"}
                      </button>
                      <button
                        onClick={() => deleteUser(u)}
                        disabled={!!busyIds[u.id]}
                        className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
