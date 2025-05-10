export default function BusinessDashboard() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Business Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div className="p-4 bg-white rounded-lg shadow">
					<h2 className="text-lg font-semibold mb-2">Products</h2>
					<p className="text-gray-600">Manage your product catalog</p>
				</div>
				<div className="p-4 bg-white rounded-lg shadow">
					<h2 className="text-lg font-semibold mb-2">Orders</h2>
					<p className="text-gray-600">View and manage customer orders</p>
				</div>
				<div className="p-4 bg-white rounded-lg shadow">
					<h2 className="text-lg font-semibold mb-2">Profile</h2>
					<p className="text-gray-600">Manage your business profile</p>
				</div>
			</div>
		</div>
	);
}
