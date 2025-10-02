"use client";

import React, { useEffect, useState } from "react";

type Notice = {
  message: string;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string;   // ISO yyyy-mm-dd
  active: boolean;
};

export default function AdminNoticePage() {
  const [form, setForm] = useState<Notice>({ message: "", startDate: "", endDate: "", active: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/notice", { cache: "no-store" });
        const data = await res.json();
        setForm({
          message: data.message || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          active: Boolean(data.active),
        });
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/admin/notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">Create / Update Notice</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg border p-5">
        <div>
          <label className="block text-sm font-medium mb-1">Notice text</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full rounded border px-3 py-2 min-h-[120px]"
            placeholder="e.g., हमारे स्टोर में अवकाश घोषित किया गया है।"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="h-4 w-4"
              />
              <span>Active</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded bg-gray-900 text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Notice"}
          </button>
          {saved && <span className="text-green-600">Saved!</span>}
          {error && <span className="text-red-600">{error}</span>}
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-600">
        <p>
          Tip: Public page <code>/notice</code> can read this data and show the banner during the active period.
        </p>
      </div>
    </div>
  );
}
