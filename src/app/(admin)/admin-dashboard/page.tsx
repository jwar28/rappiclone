export default function AdminDashboard() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div className="p-4 bg-white rounded-lg shadow">
					<h2 className="text-lg font-semibold mb-2">Businesses</h2>
					<p className="text-gray-600">Manage business accounts and settings</p>
				</div>
				<div className="p-4 bg-white rounded-lg shadow">
					<h2 className="text-lg font-semibold mb-2">Users</h2>
					<p className="text-gray-600">Manage user accounts and permissions</p>
				</div>
			</div>
		</div>
	);
}
