"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, Clock, Plus, Minus, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getBusinesses } from "../../../api/business";
import { getProductsByBusinessId } from "../../../api/products";
import type { Business, Product } from "../../../types/database.types";
import { useCartStore } from "../../../stores/cart";
import { useOrdersStore } from "../../../stores/orders";
import { useRouter } from "next/navigation";
import { addOrder } from "../../../api/orders";
import { supabase } from "../../../utils/supabase/client";
import { useAuthStore } from "../../../stores/auth-store";
import { NavUser } from "../../../components/business/nav-user";

interface TransformedOrder {
	id: string;
	items: Array<{
		id: string;
		name: string;
		quantity: number;
		price: number;
		image_url?: string;
	}>;
	total: number;
	status: string;
	createdAt: Date;
	estimatedDeliveryTime: number;
	businessId: string;
	businessName: string;
	shippingAddress: string;
}

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

const generateUUID = () => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export default function HomePage() {
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [businesses, setBusinesses] = useState<Business[]>([]);
	const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [showCheckout, setShowCheckout] = useState(false);
	const { user } = useAuthStore();

	const { items: cartItems, addItem, removeItem, getTotal, clearCart } = useCartStore();
	const { getActiveOrders } = useOrdersStore();
	const [activeOrders, setActiveOrders] = useState<TransformedOrder[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const businessesData = await getBusinesses();
				setBusinesses(businessesData);

				const productsPromises = businessesData
					.slice(0, 3)
					.map((business: Business) => getProductsByBusinessId(business.id));
				const productsResults = await Promise.all(productsPromises);
				const allProducts = productsResults.flat();
				setFeaturedProducts(allProducts.slice(0, 8));

				// Fetch pending orders
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (user) {
					const { data: orders } = await supabase
						.from("orders")
						.select(`
							*,
							businesses:business_id (name),
							order_items (
								id,
								product_name,
								quantity,
								unit_price,
								product_id
							)
						`)
						.eq("customer_id", user.id)
						.eq("status", "pending");

					if (orders) {
						// Transform the orders to match the expected format
						const transformedOrders: TransformedOrder[] = orders.map((order) => ({
							id: order.id,
							items: order.order_items.map(
								(item: {
									product_id: string | null;
									product_name: string;
									quantity: number;
									unit_price: number;
								}) => ({
									id: item.product_id || "",
									name: item.product_name,
									quantity: item.quantity,
									price: item.unit_price,
									image_url: undefined,
								}),
							),
							total: order.total_amount,
							status: order.status,
							createdAt: new Date(order.created_at),
							estimatedDeliveryTime: new Date(order.created_at).getTime() + 45 * 60000, // 45 minutes from creation
							businessId: order.business_id || "",
							businessName: order.businesses?.name || "Unknown Business",
							shippingAddress: order.shipping_address,
						}));
						setActiveOrders(transformedOrders);
					}
				}
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
						{user && (
							<NavUser
								user={{
									name: user.full_name,
									email: user.email,
									avatar: null,
								}}
							/>
						)}
					</div>
				</div>
			</header>

			<main className="max-w-9xl mx-auto px-4 py-6">
				{/* Active Orders Section */}
				{activeOrders.length > 0 && (
					<section className="mb-8">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-semibold">Pedidos Activos</h2>
							<Link
								href="/tracking"
								className="text-sm text-green-600 hover:text-green-700 font-medium"
							>
								Ver todos
							</Link>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{activeOrders.map((order) => (
								<Link
									href={`/tracking/${order.id}`}
									key={order.id}
									className="block transition-transform hover:scale-[1.02]"
								>
									<motion.div
										whileHover={{ y: -4 }}
										className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 cursor-pointer relative group flex flex-col min-h-[180px]"
									>
										<div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity" />
										<div className="flex items-start justify-between mb-3">
											<div>
												<h3 className="font-medium">{order.businessName}</h3>
												<p className="text-sm text-gray-600">Pedido #{order.id.slice(0, 8)}</p>
											</div>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													order.status === "pending"
														? "bg-yellow-100 text-yellow-700"
														: order.status === "preparing"
															? "bg-blue-100 text-blue-700"
															: "bg-green-100 text-green-700"
												}`}
											>
												{order.status === "pending"
													? "Pendiente"
													: order.status === "preparing"
														? "Preparando"
														: "En camino"}
											</span>
										</div>
										<div className="space-y-2 mb-3">
											{order.items.map((item) => (
												<div key={item.id} className="flex items-center gap-2">
													<div className="w-8 h-8 relative flex-shrink-0">
														<Image
															src={item.image_url || "/images/placeholder-product.jpg"}
															alt={item.name}
															fill
															className="object-contain rounded"
															unoptimized={!item.image_url}
														/>
													</div>
													<div className="flex-1">
														<p className="text-sm">{item.name}</p>
														<p className="text-xs text-gray-600">
															{item.quantity}x ${item.price}
														</p>
													</div>
												</div>
											))}
										</div>
										<div className="flex items-center justify-between pt-3 border-t">
											<div className="flex items-center gap-2 text-sm text-gray-600">
												<Clock size={16} />
												<span>
													{order.estimatedDeliveryTime
														? `Entrega estimada: ${new Date(
																order.estimatedDeliveryTime,
															).toLocaleTimeString()}`
														: "Tiempo estimado: 30-45 min"}
												</span>
											</div>
											<span className="font-medium text-green-600">${order.total.toFixed(2)}</span>
										</div>
										<div className="absolute right-4 top-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
											<ArrowRight size={20} />
										</div>
									</motion.div>
								</Link>
							))}
						</div>
					</section>
				)}

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

				{/* Personal Delivery Section */}
				<section className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold">Envíos Particulares</h2>
					</div>
					<div className="bg-white rounded-xl shadow-sm p-6">
						<div className="flex items-center gap-4">
							<div className="bg-green-100 p-4 rounded-full">
								{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-8 w-8 text-green-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-label="Package delivery icon"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
									/>
								</svg>
							</div>
							<div className="flex-1">
								<h3 className="font-medium text-lg mb-1">¿Necesitas enviar algo?</h3>
								<p className="text-gray-600 text-sm">
									Envía paquetes, documentos o cualquier artículo de forma rápida y segura
								</p>
							</div>
							<button
								type="button"
								className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
							>
								Nuevo envío
							</button>
						</div>
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
													onClick={() =>
														addItem({
															id: product.id,
															name: product.name,
															price: product.price,
															quantity: 1,
															image_url: product.image_url || undefined,
															businessId: product.business_id,
															businessName:
																businesses.find((b) => b.id === product.business_id)?.name ||
																"Unknown Business",
														})
													}
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
							onClick={() => setShowCheckout(true)}
							className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 hover:bg-green-700 transition-colors"
						>
							Realizar Pedido
						</button>
					</div>
				</div>
			)}

			{/* Checkout Modal */}
			{showCheckout && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-bold">Checkout</h2>
								<button
									type="button"
									onClick={() => setShowCheckout(false)}
									className="p-2 hover:bg-gray-100 rounded-full"
								>
									<X size={24} />
								</button>
							</div>

							{/* Order Summary */}
							<div className="mb-6">
								<h3 className="font-semibold mb-3">Resumen del Pedido</h3>
								<div className="space-y-3">
									{cartItems.map((item) => (
										<div key={item.id} className="flex justify-between items-center">
											<div className="flex items-center gap-3">
												<span className="text-gray-600">{item.quantity}x</span>
												<span>{item.name}</span>
											</div>
											<span className="font-medium">
												${(item.price * item.quantity).toFixed(2)}
											</span>
										</div>
									))}
									<div className="border-t pt-3 mt-3">
										<div className="flex justify-between font-semibold">
											<span>Total</span>
											<span className="text-green-600">${getTotal().toFixed(2)}</span>
										</div>
									</div>
								</div>
							</div>

							{/* Payment Form */}
							<form
								className="space-y-4"
								onSubmit={async (e) => {
									e.preventDefault();

									const form = e.target as HTMLFormElement;
									const name = (form.querySelector("#name") as HTMLInputElement).value;
									const email = (form.querySelector("#email") as HTMLInputElement).value;
									const address = (form.querySelector("#address") as HTMLInputElement).value;

									if (!address) {
										alert("Por favor ingresa una dirección de entrega");
										return;
									}

									if (cartItems.length === 0) {
										alert("El carrito está vacío");
										return;
									}

									try {
										// Create a new order
										const newOrder = {
											id: generateUUID(),
											items: cartItems.map((item) => ({
												id: item.id,
												name: item.name,
												quantity: item.quantity,
												price: item.price,
												image_url: item.image_url,
											})),
											total: getTotal(),
											status: "pending" as const,
											createdAt: new Date(),
											estimatedDeliveryTime: new Date(Date.now() + 45 * 60000), // 45 minutes from now
											businessId: cartItems[0]?.businessId || "",
											businessName: cartItems[0]?.businessName || "Unknown Business",
											shippingAddress: address,
										};

										// Add the order to Supabase
										const orderResult = await addOrder(newOrder);
										console.log("Order created successfully:", orderResult);

										// Add the order to the local store
										useOrdersStore.getState().addOrder(newOrder);

										// Clear the cart
										clearCart();
										// Close the modal
										setShowCheckout(false);
										// Redirect to tracking page
										router.push(`/tracking/${newOrder.id}`);
									} catch (error) {
										console.error("Error creating order:", error);
										alert(
											error instanceof Error
												? error.message
												: "Error creating order. Please try again.",
										);
									}
								}}
							>
								<div>
									<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
										Información Personal
									</label>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<input
												id="name"
												type="text"
												placeholder="Nombre"
												className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
												defaultValue="Juan Pérez"
											/>
										</div>
										<div>
											<input
												id="email"
												type="email"
												placeholder="Email"
												className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
												defaultValue="juan@example.com"
											/>
										</div>
									</div>
								</div>

								<div>
									<label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
										Dirección de Entrega
									</label>
									<input
										id="address"
										type="text"
										placeholder="Dirección"
										className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
										defaultValue="Calle Principal 123"
									/>
								</div>

								<div>
									<label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">
										Información de Pago
									</label>
									<div className="space-y-3">
										<div>
											<input
												id="card"
												type="text"
												placeholder="Número de Tarjeta"
												className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
												defaultValue="4242 4242 4242 4242"
											/>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<input
													id="expiry"
													type="text"
													placeholder="MM/AA"
													className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
													defaultValue="12/25"
												/>
											</div>
											<div>
												<input
													id="cvc"
													type="text"
													placeholder="CVC"
													className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
													defaultValue="123"
												/>
											</div>
										</div>
									</div>
								</div>

								<button
									type="submit"
									className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
								>
									Pagar ${getTotal().toFixed(2)}
								</button>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
