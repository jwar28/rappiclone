"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Star, Clock, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getBusinesses } from "../../../api/business";
import { getProductsByBusinessId } from "../../../api/products";
import type { Business, Product } from "../../../types/database.types";
import { useCartStore } from "../../../stores/cart";

const categories = [
	{
		id: 1,
		name: "Restaurantes",
		displayName: "Restaurantes",
		icon: "🍽️",
		color: "bg-orange-500",
		dbName: "restaurant",
	},
	{
		id: 2,
		name: "Supermercados",
		displayName: "Supermercados",
		icon: "🛒",
		color: "bg-green-500",
		dbName: "supermarket",
	},
	{
		id: 3,
		name: "Farmacias",
		displayName: "Farmacias",
		icon: "💊",
		color: "bg-blue-500",
		dbName: "pharmacy",
	},
];

export default function HomePage() {
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [businesses, setBusinesses] = useState<Business[]>([]);
	const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	const { items: cartItems, addItem, removeItem, getTotal, getItemCount } = useCartStore();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const businessesData = await getBusinesses();
				setBusinesses(businessesData);

				// Obtener productos destacados de las primeras 3 tiendas
				const productsPromises = businessesData
					.slice(0, 3)
					.map((business: Business) => getProductsByBusinessId(business.id));
				const productsResults = await Promise.all(productsPromises);
				const allProducts = productsResults.flat();
				setFeaturedProducts(allProducts.slice(0, 6)); // Mostrar 6 productos destacados
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const filteredBusinesses = selectedCategory
		? businesses.filter((business) => business.category === categories[selectedCategory - 1].dbName)
		: businesses;

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm sticky top-0 z-50">
				<div className="max-w-9xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-green-600">RapiClone</h1>
						<div className="relative flex-1 max-w-xl mx-4">
							<input
								type="text"
								placeholder="Buscar restaurantes, productos..."
								className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
							<Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-9xl mx-auto px-4 py-6">
				{/* Categories */}
				<section className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold">Categorías</h2>
						{selectedCategory && (
							<button
								type="button"
								onClick={() => setSelectedCategory(null)}
								className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
							>
								Limpiar filtro
							</button>
						)}
					</div>
					<div className="grid grid-cols-3 gap-4">
						{categories.map((category) => (
							<motion.button
								key={category.id}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className={`${category.color} p-6 rounded-xl text-white flex flex-col items-center justify-center gap-2 ${
									selectedCategory === category.id ? "ring-2 ring-offset-2 ring-black" : ""
								}`}
								onClick={() => setSelectedCategory(category.id)}
							>
								<span className="text-3xl">{category.icon}</span>
								<span className="font-medium">{category.name}</span>
							</motion.button>
						))}
					</div>
				</section>

				{/* Featured Stores */}
				<section className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold">
							{selectedCategory
								? `Tiendas de ${categories[selectedCategory - 1].displayName}`
								: "Tiendas Destacadas"}
						</h2>
						{selectedCategory && (
							<span className="text-sm text-gray-600">
								{filteredBusinesses.length} tiendas encontradas
							</span>
						)}
					</div>
					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 3 }).map((_, index) => (
								<div
									key={`store-skeleton-${index + 1}`}
									className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
								>
									<div className="h-48 bg-gray-200 rounded-lg mb-4" />
									<div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
									<div className="h-4 bg-gray-200 rounded w-1/2" />
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-wrap justify-evenly gap-6">
							{filteredBusinesses.map((business) => (
								<Link href={`/store/${business.id}`} key={business.id}>
									<motion.div
										whileHover={{ y: -6, boxShadow: "0 4px 16px rgba(16, 185, 129, 0.10)" }}
										className="bg-white rounded-xl shadow group border border-gray-100 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col items-center hover:shadow-lg"
										style={{ minHeight: 220, maxWidth: 220 }}
									>
										<div
											className="w-full flex justify-center items-center bg-gray-50"
											style={{ minHeight: 90 }}
										>
											<Image
												src={business.logo_url || "/images/placeholder-store.jpg"}
												alt={business.name}
												width={60}
												height={60}
												className="object-contain rounded-lg group-hover:scale-105 transition-transform duration-200"
												unoptimized={!business.logo_url}
											/>
										</div>
										<div className="flex-1 w-full flex flex-col items-center justify-between p-2">
											<h3 className="font-bold text-base text-center text-gray-900 mb-1 truncate w-full">
												{business.name}
											</h3>
											<div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-1">
												<div className="flex items-center gap-1">
													<Star className="text-yellow-400" size={13} />
													<span>Nuevo</span>
												</div>
												<div className="flex items-center gap-1">
													<Clock size={13} />
													<span>15-30 min</span>
												</div>
											</div>
											<span
												className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
													business.category === "restaurant"
														? "bg-orange-100 text-orange-700"
														: business.category === "supermarket"
															? "bg-green-100 text-green-700"
															: business.category === "pharmacy"
																? "bg-blue-100 text-blue-700"
																: "bg-gray-100 text-gray-700"
												}`}
											>
												{business.category === "restaurant" && "Restaurante"}
												{business.category === "supermarket" && "Supermercado"}
												{business.category === "pharmacy" && "Farmacia"}
											</span>
										</div>
									</motion.div>
								</Link>
							))}
						</div>
					)}
				</section>

				{/* Featured Products */}
				{!selectedCategory && (
					<section>
						<h2 className="text-xl font-semibold mb-4">Productos Destacados</h2>
						{loading ? (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{Array.from({ length: 4 }).map((_, index) => (
									<div
										key={`product-skeleton-${index + 1}`}
										className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
									>
										<div className="h-32 bg-gray-200 rounded-lg mb-4" />
										<div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
										<div className="h-4 bg-gray-200 rounded w-1/2" />
									</div>
								))}
							</div>
						) : (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{featuredProducts.map((product) => (
									<motion.div
										key={product.id}
										whileHover={{ y: -5 }}
										className="bg-white rounded-lg shadow-sm overflow-hidden"
									>
										<div className="relative h-32 flex items-center justify-center bg-gray-100">
											<Image
												src={product.image_url || "/images/placeholder-product.jpg"}
												alt={product.name}
												width={150}
												height={150}
												className="object-contain"
												unoptimized={!product.image_url}
											/>
										</div>
										<div className="p-4">
											<h3 className="font-medium text-sm mb-1">{product.name}</h3>
											<div className="flex items-center justify-between">
												<p className="text-green-600 font-semibold">${product.price}</p>
												<button
													type="button"
													onClick={() => addItem(product)}
													className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
												>
													<Plus size={16} />
												</button>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						)}
					</section>
				)}
			</main>

			{/* Cart Sidebar */}
			{cartItems.length > 0 && (
				<div className="fixed bottom-0 left-0 right-0 md:right-4 md:bottom-4 md:left-auto md:w-96 bg-white rounded-t-xl md:rounded-xl shadow-lg">
					<div className="p-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-semibold text-lg">Carrito</h3>
							<span className="text-green-600 font-semibold">${getTotal().toFixed(2)}</span>
						</div>
						<div className="space-y-4 max-h-96 overflow-y-auto">
							{cartItems.map((item) => (
								<div key={item.id} className="flex items-center gap-4">
									<div className="relative w-16 h-16 flex-shrink-0">
										<Image
											src={item.image_url || "/images/placeholder-product.jpg"}
											alt={item.name}
											fill
											className="object-contain rounded"
											unoptimized={!item.image_url}
										/>
									</div>
									<div className="flex-1">
										<h4 className="font-medium text-sm">{item.name}</h4>
										<p className="text-green-600 font-semibold">${item.price}</p>
									</div>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => removeItem(item.id)}
											className="p-1 hover:bg-gray-100 rounded-full"
										>
											<Minus size={16} />
										</button>
										<span className="w-8 text-center">{item.quantity}</span>
										<button
											type="button"
											onClick={() => addItem(item)}
											className="p-1 hover:bg-gray-100 rounded-full"
										>
											<Plus size={16} />
										</button>
									</div>
								</div>
							))}
						</div>
						<button
							type="button"
							className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 hover:bg-green-700 transition-colors"
						>
							Realizar Pedido
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
