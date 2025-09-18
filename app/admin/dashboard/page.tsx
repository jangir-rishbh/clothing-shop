export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Welcome, Admin! Here you can see quick stats and summaries.</p>
      <div className="mt-6">
        <a
          href="/admin/profile"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Edit My Profile
        </a>
      </div>
    </div>
  );
}
