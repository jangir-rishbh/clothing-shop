"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { products, type Product } from "@/data/products";

export default function AdminProductsPage() {
  const [featured, setFeatured] = useState<string[]>([]);
  const [overrides, setOverrides] = useState<Record<string, { image?: string }>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch("/api/admin/products/featured", { cache: "no-store" });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.error || "Failed to load featured");
        setFeatured(data.featured || []);

        const r2 = await fetch("/api/admin/products/overrides", { cache: "no-store" });
        const d2 = await r2.json();
        if (!r2.ok) throw new Error(d2?.error || "Failed to load overrides");
        const map: Record<string, { image?: string }> = {};
        (d2.overrides || []).forEach((o: { product_id: string; image?: string }) => {
          map[o.product_id] = { image: o.image };
        });
        setOverrides(map);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load featured";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered: Product[] = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [search]);

  const toggleFeatured = async (id: string, makeFeatured: boolean) => {
    try {
      const resp = await fetch("/api/admin/products/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, featured: makeFeatured }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Failed to update");
      setFeatured((prev) =>
        makeFeatured ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)
      );
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const saveImage = async (id: string, imageUrl: string) => {
    try {
      const resp = await fetch('/api/admin/products/overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, image: imageUrl }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to save image');
      setOverrides(prev => ({ ...prev, [id]: { ...(prev[id] || {}), image: imageUrl } }));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to save image');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      <div className="flex items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-72"
          placeholder="Search products by name or category"
        />
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{error}</div>
      )}

      {loading ? (
        <div className="p-4">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="border rounded p-4">
              <div className="font-semibold text-lg">{p.name}</div>
              <div className="text-sm text-gray-500 mb-2">{p.category}</div>
              <div className="text-gray-900 mb-2">₹{p.price}</div>
              <div className="mb-2 relative w-full h-40">
                <Image
                  src={overrides[p.id]?.image || p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded border"
                />
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  defaultValue={overrides[p.id]?.image || ''}
                  placeholder="Paste new image URL"
                  className="border rounded px-3 py-2 flex-1"
                  onBlur={(e) => {
                    const url = e.target.value.trim();
                    if (url) saveImage(p.id, url);
                  }}
                />
                <button
                  onClick={() => {
                    const input = (document.activeElement as HTMLInputElement);
                    const url = input?.value?.trim();
                    if (url) saveImage(p.id, url);
                  }}
                  className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <label className="px-3 py-2 rounded cursor-pointer bg-purple-600 hover:bg-purple-700 text-white">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSelectedFiles(prev => ({ ...prev, [p.id]: file }));
                    }}
                  />
                </label>
                {selectedFiles[p.id] && (
                  <>
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {selectedFiles[p.id]?.name}
                    </span>
                    <button
                      onClick={async () => {
                        const file = selectedFiles[p.id];
                        if (!file) return;
                        const form = new FormData();
                        form.append('productId', p.id);
                        form.append('file', file);
                        const resp = await fetch('/api/admin/products/upload', { method: 'POST', body: form });
                        const data = await resp.json();
                        if (!resp.ok) {
                          alert(data?.error || 'Upload failed');
                          return;
                        }
                        setOverrides(prev => ({ ...prev, [p.id]: { ...(prev[p.id] || {}), image: data.image } }));
                        setSelectedFiles(prev => ({ ...prev, [p.id]: null }));
                      }}
                      className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Update Image
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => toggleFeatured(p.id, !featured.includes(p.id))}
                  className={`px-3 py-1 rounded text-white ${
                    featured.includes(p.id)
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {featured.includes(p.id) ? "Unfeature" : "Make Featured"}
                </button>
                <a
                  href={`/products/${p.id}`}
                  className="px-3 py-1 rounded border hover:bg-gray-50"
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
