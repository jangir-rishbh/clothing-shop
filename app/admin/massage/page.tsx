'use client';

import { useEffect, useMemo, useState, Fragment } from 'react';

type ContactMessage = {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at?: string | null;
  status?: string;
  is_read?: boolean;
  replies?: {
    id: string;
    admin_reply: string;
    created_at: string;
  }[];
};

export default function AdminMassagePage() {
	const [messages, setMessages] = useState<ContactMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [replyingTo, setReplyingTo] = useState<number | null>(null);
	const [replyText, setReplyText] = useState('');
	const [submittingReply, setSubmittingReply] = useState(false);

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

	const handleReply = async (messageId: number) => {
		if (!replyText.trim()) return;

		setSubmittingReply(true);
		try {
			const response = await fetch('/api/admin/replies', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					contact_submission_id: messageId,
					admin_reply: replyText.trim(),
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || 'Failed to send reply');
			}

			// Refresh messages
			const resp = await fetch('/api/admin/massage', { cache: 'no-store' });
			const data = await resp.json();
			if (resp.ok) {
				setMessages(data.messages || []);
			}

			setReplyText('');
			setReplyingTo(null);
		} catch (error) {
			console.error('Error sending reply:', error);
			alert(error instanceof Error ? error.message : 'Failed to send reply');
		} finally {
			setSubmittingReply(false);
		}
	};

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
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Received</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filtered.map(m => (
								<Fragment key={m.id}>
									<tr className={replyingTo === m.id ? 'bg-blue-50' : ''}>
										<td className="px-4 py-2 text-gray-900">{m.first_name} {m.last_name}</td>
										<td className="px-4 py-2 text-gray-900">{m.email}</td>
										<td className="px-4 py-2 text-gray-900">{m.phone || '-'}</td>
										<td className="px-4 py-2 text-gray-900 whitespace-pre-wrap max-w-xl">
											<div className="mb-2">{m.message}</div>
											{m.replies && m.replies.length > 0 && (
												<div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400">
													<div className="text-sm font-medium text-green-800 mb-1">Admin Replies:</div>
													{m.replies.map((reply, index) => (
														<div key={reply.id} className="text-sm text-green-700 mb-1">
															<div className="font-medium">Reply {index + 1}:</div>
															<div className="whitespace-pre-wrap">{reply.admin_reply}</div>
															<div className="text-xs text-green-600 mt-1">
																{new Date(reply.created_at).toLocaleString()}
															</div>
														</div>
													))}
												</div>
											)}
										</td>
										<td className="px-4 py-2 text-gray-900">
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${
												m.status === 'new' ? 'bg-blue-100 text-blue-800' :
												m.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
												m.status === 'resolved' ? 'bg-green-100 text-green-800' :
												'bg-gray-100 text-gray-800'
											}`}>
												{m.status || 'new'}
											</span>
										</td>
										<td className="px-4 py-2 text-gray-900">{m.created_at ? new Date(m.created_at).toLocaleString() : '-'}</td>
										<td className="px-4 py-2 text-gray-900">
											<button
												onClick={() => setReplyingTo(replyingTo === m.id ? null : m.id as number)}
												className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
											>
												{replyingTo === m.id ? 'Cancel' : 'Reply'}
											</button>
										</td>
									</tr>
									{replyingTo === m.id && (
									<tr key={`${m.id}-reply`}>
											<td colSpan={7} className="px-4 py-4 bg-blue-50">
												<div className="space-y-2">
													<textarea
														value={replyText}
														onChange={(e) => setReplyText(e.target.value)}
														placeholder="Type your reply here..."
														className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
														rows={3}
													/>
													<div className="flex gap-2">
														<button
															onClick={() => handleReply(m.id as number)}
															disabled={submittingReply || !replyText.trim()}
															className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
														>
															{submittingReply ? 'Sending...' : 'Send Reply'}
														</button>
														<button
															onClick={() => {
																setReplyingTo(null);
																setReplyText('');
															}}
															className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
														>
															Cancel
														</button>
													</div>
												</div>
											</td>
										</tr>
								)}
							</Fragment>
						))}
							{filtered.length === 0 && (
								<tr>
									<td className="px-4 py-6 text-center text-gray-500" colSpan={7}>No messages</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
