"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { Card } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import type { LatLngTuple } from "leaflet";
import { Plane, Package, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { trackActiveOrder } from "@/src/api/orders";
import type { Order } from "@/src/types/database.types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useOrdersStore } from "@/src/stores/orders";
import { supabase } from "@/src/utils/supabase/client";
import FadeContent from "@/src/components/ui/fade-content";

// Fix for default marker icon
const icon = new Icon({
	iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});

// Bucaramanga coordinates
const route: LatLngTuple[] = [
	[7.1257, -73.129], // Restaurante
	[7.126, -73.128],
	[7.127, -73.127],
	[7.128, -73.126], // Destino
];

export default function TrackingPage() {
	const params = useParams();
	const [timeLeft, setTimeLeft] = useState(15);
	const [progress, setProgress] = useState(0);
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const orderId = params.id as string;
				const orderData = await trackActiveOrder(orderId);
				if (orderData && orderData.length > 0) {
					setOrder(orderData[0]);
				} else {
					setError("Order not found");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to fetch order");
			} finally {
				setLoading(false);
			}
		};

		fetchOrder();
	}, [params.id]);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 0) {
					clearInterval(timer);
					// Update order status to delivered
					if (order) {
						useOrdersStore.getState().updateOrderStatus(order.id, "delivered");
						// Update the order in the database
						supabase
							.from("orders")
							.update({ status: "delivered", updated_at: new Date().toISOString() })
							.eq("id", order.id);
					}
					return 0;
				}
				return prev - 1;
			});
		}, 60000); // Update every minute

		return () => clearInterval(timer);
	}, [order]);

	useEffect(() => {
		// Update progress based on time left
		setProgress(((15 - timeLeft) / 15) * 100);
	}, [timeLeft]);

	if (loading) {
		return (
			<div className="container mx-auto p-4 max-w-4xl">
				<div className="flex items-center justify-center h-[50vh]">
					<p className="text-lg">Cargando información del pedido...</p>
				</div>
			</div>
		);
	}

	if (error || !order) {
		return (
			<div className="container mx-auto p-4 max-w-4xl">
				<div className="flex items-center justify-center h-[50vh]">
					<p className="text-lg text-red-600">{error || "Pedido no encontrado"}</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<FadeContent>
				<div className="container mx-auto p-4 max-w-4xl">
					<div className="flex items-center justify-between mb-6">
						<Link
							href="/home"
							className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
						>
							<ArrowLeft className="w-5 h-5" />
							<span>Volver al inicio</span>
						</Link>
						<div className="flex items-center gap-2">
							<Plane className="w-8 h-8 text-blue-600" />
							<h1 className="text-2xl font-bold">Seguimiento de tu pedido</h1>
						</div>
					</div>

					<div className="grid gap-6">
						{/* Map Section */}
						<Card className="p-4 overflow-hidden">
							<div className="h-[400px] w-full relative">
								<MapContainer
									center={[7.1257, -73.129]}
									zoom={15}
									style={{ height: "100%", width: "100%" }}
								>
									<TileLayer
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
										attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									/>
									<Marker position={[7.1257, -73.129]} icon={icon}>
										<Popup>Restaurante</Popup>
									</Marker>
									<Marker position={[7.128, -73.126]} icon={icon}>
										<Popup>Tu ubicación</Popup>
									</Marker>
									<Polyline positions={route} color="#3B82F6" weight={3} opacity={0.7} />
								</MapContainer>
								<motion.div
									className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
									animate={{
										x: [0, 100, 200, 300],
										y: [0, -50, 0, -50],
									}}
									transition={{
										duration: 8,
										repeat: Number.POSITIVE_INFINITY,
										ease: "linear",
									}}
								>
									<Plane className="w-8 h-8 text-blue-600" />
								</motion.div>
							</div>
						</Card>

						{/* Delivery Info */}
						<Card className="p-6">
							<div className="space-y-6">
								<div className="flex justify-between items-center">
									<div className="flex items-center gap-2">
										<Plane className="w-6 h-6 text-blue-600" />
										<h2 className="text-xl font-semibold">Estado del pedido</h2>
									</div>
									<span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
										{order.status === "pending"
											? "Pendiente"
											: order.status === "preparing"
												? "Preparando"
												: order.status === "delivering"
													? "En entrega"
													: "Entregado"}
									</span>
								</div>

								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<Clock className="w-5 h-5 text-gray-500" />
										<div className="flex-1">
											<div className="flex justify-between text-sm mb-1">
												<span className="text-gray-600">Tiempo estimado de llegada</span>
												<span className="font-medium">{timeLeft} minutos</span>
											</div>
											<Progress value={progress} className="h-2" />
										</div>
									</div>

									<div className="flex items-center gap-4">
										<MapPin className="w-5 h-5 text-gray-500" />
										<div>
											<p className="text-sm text-gray-600">Dirección de entrega</p>
											<p className="font-medium">{order.shipping_address}</p>
										</div>
									</div>
								</div>

								<div className="bg-gray-50 p-4 rounded-lg space-y-4">
									<div className="flex items-center gap-2">
										<Package className="w-5 h-5 text-gray-500" />
										<h3 className="font-medium">Detalles del pedido</h3>
									</div>
									<div className="space-y-3">
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Número de pedido</span>
											<span className="font-medium">#{order.id}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Fecha de pedido</span>
											<span className="font-medium">
												{new Date(order.created_at).toLocaleDateString()}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">Total</span>
											<span className="font-medium">${order.total_amount.toFixed(2)}</span>
										</div>
									</div>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</FadeContent>
		</>
	);
}
