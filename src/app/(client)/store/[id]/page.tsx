"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, ShoppingBag, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { getBusinessById } from "../../../../api/business";
import { getProductsByBusinessId } from "../../../../api/products";
import type { Business, Product } from "../../../../types/database.types";
import { useCartStore } from "../../../../stores/cart";

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const [store, setStore] = useState<Business | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	const { items: cartItems, addItem, removeItem, getTotal, getItemCount } = useCartStore();

	useEffect(() => {
		const fetchStoreData = async () => {
			try {
				const storeData = await getBusinessById(id);
				setStore(storeData);

				if (storeData) {
					const productsData = await getProductsByBusinessId(storeData.id);
					setProducts(productsData);
				}
			} catch (error) {
				console.error("Error fetching store data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchStoreData();
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 p-4">
				<div className="max-w-7xl mx-auto">
					<div className="animate-pulse">
						<div className="h-64 bg-gray-200 rounded-xl mb-8" />
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
						<div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[...Array(6)].map((_, index) => (
								<div
									key={`product-skeleton-${index + 1}`}
									className="bg-white rounded-lg shadow-sm p-4"
								>
									<div className="h-32 bg-gray-200 rounded-lg mb-4" />
									<div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
									<div className="h-4 bg-gray-200 rounded w-1/2" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!store) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-semibold text-gray-800 mb-2">Tienda no encontrada</h1>
					<p className="text-gray-600">La tienda que buscas no existe o ha sido eliminada.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Store Header */}
			<div className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex flex-col md:flex-row gap-6">
						<div className="relative w-full md:w-64 h-48 md:h-64 flex-shrink-0">
							<Image
								src={store.logo_url || "/images/placeholder-store.jpg"}
								alt={store.name}
								fill
								className="object-contain rounded-lg"
								unoptimized={!store.logo_url}
							/>
						</div>
						<div className="flex-1">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h1>
							<div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
								<div className="flex items-center gap-1">
									<Star className="text-yellow-400" size={16} />
									<span>Nuevo</span>
								</div>
								<div className="flex items-center gap-1">
									<Clock size={16} />
									<span>15-30 min</span>
								</div>
							</div>
							<div className="flex items-center gap-2 text-gray-600 mb-4">
								<MapPin size={16} />
								<span>{store.address}</span>
							</div>
							{store.description && <p className="text-gray-600">{store.description}</p>}
						</div>
					</div>
				</div>
			</div>

			{/* Products Grid */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				<h2 className="text-2xl font-semibold mb-6">Productos</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{products.map((product) => (
						<motion.div
							key={product.id}
							whileHover={{ y: -5 }}
							className="bg-white rounded-lg shadow-sm overflow-hidden"
						>
							<div className="relative h-48 flex items-center justify-center bg-gray-100">
								<Image
									src={product.image_url || "/images/placeholder-product.jpg"}
									alt={product.name}
									width={200}
									height={200}
									className="object-contain"
									unoptimized={!product.image_url}
								/>
							</div>
							<div className="p-4">
								<h3 className="font-semibold text-lg mb-2">{product.name}</h3>
								{product.description && (
									<p className="text-gray-600 text-sm mb-2">{product.description}</p>
								)}
								<div className="flex items-center justify-between">
									<span className="text-green-600 font-semibold">${product.price}</span>
									<button
										type="button"
										onClick={() =>
											addItem({
												...product,
												quantity: 1,
												businessId: product.business_id,
												businessName: product.name,
												image_url: product.image_url ?? undefined,
											})
										}
										className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
									>
										Agregar
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>

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
