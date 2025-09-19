"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { products, type Product } from "@/data/products";

export default function AdminProductsPage() {
  const [featured, setFeatured] = useState<string[]>([]);
  const [overrides, setOverrides] = useState<Record<string, { image?: string }>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState(true);
  const [custom, setCustom] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ id: '', name: '', price: '', category: '', description: '' });

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

        const r3 = await fetch('/api/admin/products/custom', { cache: 'no-store' });
        const d3: { products?: Array<{ id: string; name: string; price: number | string; image?: string | null; category?: string | null; description?: string | null; }> } = await r3.json();
        if (r3.ok) {
          const customList: Product[] = (d3.products || []).map((p) => ({
            id: String(p.id),
            name: String(p.name),
            price: Number(p.price),
            image: p.image || '',
            category: p.category || 'Custom',
            description: p.description || undefined,
          }));
          setCustom(customList);
        }
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
    const all = [...custom, ...products];
    if (!q) return all;
    return all.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [search, custom]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        id: createForm.id.trim(),
        name: createForm.name.trim(),
        price: Number(createForm.price),
        category: createForm.category.trim(),
        description: createForm.description.trim() || null,
      };
      const resp = await fetch('/api/admin/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Failed to create');
      // Optimistic add: push into overrides and featured maps if necessary
      setCustom(prev => [{
        id: data.product.id,
        name: data.product.name,
        price: Number(data.product.price),
        image: '',
        category: data.product.category || 'Custom',
        description: data.product.description || undefined,
      }, ...prev]);
      // Clear form
      setCreateForm({ id: '', name: '', price: '', category: '', description: '' });
      alert('Product created');
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to create');
    } finally {
      setCreating(false);
    }
  };

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

  // no-op

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

      <div className="mb-6 border rounded p-4">
        <h3 className="font-semibold mb-3">Create Product Card</h3>
        <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="ID (unique)" value={createForm.id} onChange={e => setCreateForm({ ...createForm, id: e.target.value })} required />
          <input className="border rounded px-3 py-2" placeholder="Name" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} required />
          <input className="border rounded px-3 py-2" placeholder="Price" type="number" value={createForm.price} onChange={e => setCreateForm({ ...createForm, price: e.target.value })} required />
          <input className="border rounded px-3 py-2" placeholder="Category" value={createForm.category} onChange={e => setCreateForm({ ...createForm, category: e.target.value })} required />
          <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Description (optional)" value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} />
          <div className="md:col-span-2">
            <button disabled={creating} className={`px-4 py-2 rounded text-white ${creating ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
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
                  src={(overrides[p.id]?.image && overrides[p.id]?.image!.length > 0) ? overrides[p.id]!.image! : (p.image && p.image.length > 0 ? p.image : 'https://placehold.co/800x600/png?text=No+Image')}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded border"
                />
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
                {overrides[p.id]?.image && (
                  <button
                    onClick={async () => {
                      if (!confirm('Remove uploaded image?')) return;
                      const resp = await fetch(`/api/admin/products/overrides/${p.id}`, { method: 'DELETE' });
                      const data = await resp.json();
                      if (!resp.ok) {
                        alert(data?.error || 'Failed to remove');
                        return;
                      }
                      setOverrides(prev => { const n = { ...prev }; delete n[p.id]; return n; });
                    }}
                    className="px-3 py-1 rounded text-white bg-gray-700 hover:bg-gray-800"
                  >
                    Remove Image
                  </button>
                )}
                {custom.find(c => c.id === p.id) && (
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete product ${p.name}?`)) return;
                      const resp = await fetch(`/api/admin/products/custom/${p.id}`, { method: 'DELETE' });
                      const data = await resp.json();
                      if (!resp.ok) {
                        alert(data?.error || 'Failed to delete');
                        return;
                      }
                      setCustom(prev => prev.filter(cp => cp.id !== p.id));
                      setOverrides(prev => { const n = { ...prev }; delete n[p.id]; return n; });
                      setFeatured(prev => prev.filter(pid => pid !== p.id));
                    }}
                    className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
