'use client';

import { useEffect, useMemo, useState } from 'react';

type ContactMessage = {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at?: string | null;
};

export default function AdminMassagePage() {
	const [messages, setMessages] = useState<ContactMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			setError(null);
			try {
				const resp = await fetch('/api/admin/massage', { cache: 'no-store' });
				const data = await resp.json();
				if (!resp.ok) throw new Error(data?.error || 'Failed to load messages');
				setMessages(data.messages || []);
			} catch (e: unknown) {
				const message = e instanceof Error ? e.message : 'Failed to load messages';
				setError(message);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return messages;
		return messages.filter(m =>
			`${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
			m.email.toLowerCase().includes(q) ||
			(m.phone || '').toLowerCase().includes(q) ||
			m.message.toLowerCase().includes(q)
		);
	}, [search, messages]);

	return (
		<div>
			<h2 className="text-2xl font-bold mb-4">Messages</h2>
			<div className="flex items-center gap-3 mb-4">
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="border rounded px-3 py-2 w-72"
					placeholder="Search by name, email, phone, or text"
				/>
			</div>
			{error && (
				<div className="mb-4 rounded bg-red-50 text-red-700 p-3">{error}</div>
			)}
			{loading ? (
				<div className="p-4">Loading messages...</div>
			) : (
				<div className="overflow-x-auto border rounded">
					<table className="min-w-full divide-y divide-gray-200 text-gray-900">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Message</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Received</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filtered.map(m => (
								<tr key={m.id}>
									<td className="px-4 py-2 text-gray-900">{m.first_name} {m.last_name}</td>
									<td className="px-4 py-2 text-gray-900">{m.email}</td>
									<td className="px-4 py-2 text-gray-900">{m.phone || '-'}</td>
									<td className="px-4 py-2 text-gray-900 whitespace-pre-wrap max-w-xl">{m.message}</td>
									<td className="px-4 py-2 text-gray-900">{m.created_at ? new Date(m.created_at).toLocaleString() : '-'}</td>
								</tr>
							))}
							{filtered.length === 0 && (
								<tr>
									<td className="px-4 py-6 text-center text-gray-500" colSpan={5}>No messages</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
