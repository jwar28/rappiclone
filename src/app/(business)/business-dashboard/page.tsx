"use client";

import FadeContent from "@/src/components/ui/fade-content";
import { BusinessCard } from "@/src/components/shared/BusinessCard";
import { useBusinessStore } from "@/src/stores/business-store";
import { useOrderStore } from "@/src/stores/orders-store";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/src/components/ui/table";
import { useProfilesStore } from "@/src/stores/profiles-store";
import Link from "next/link";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useEffect } from "react";
import { useAuthStore } from "@/src/stores/auth-store";
import { loadBusinessOwnerData } from "@/src/api/load-business-owner-data";
import { Card, CardContent } from "@/src/components/ui/card";
import { TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react";

export default function BusinessDashboard() {
	const { businesses, loading } = useBusinessStore();
	const { orders, loading: loadingOrders } = useOrderStore();
	const { profiles } = useProfilesStore();
	const { user } = useAuthStore();

	useEffect(() => {
		if (user?.id && (businesses?.length === 0 || orders.length === 0)) {
			loadBusinessOwnerData(user.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id, businesses?.length, orders.length]);

	const categoriesDict = {
		restaurant: "Restaurante",
		pharmacy: "Farmacia",
		supermarket: "Supermercado",
	};

	const totalBusinesses = businesses?.length || 0;
	const sortedOrders = [...orders].sort(
		(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
	);
	const totalOrders = orders.length;
	const totalRevenue = orders.reduce((acc, order) => acc + order.total_amount, 0);
	const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

	const displayedBusinesses = businesses?.slice(0, 5) || [];
	const displayedOrders = sortedOrders.slice(0, 5);

	return (
		<FadeContent easing="ease-in-out" duration={500}>
			<div className="flex flex-col gap-4">
				{/* KPIs */}
				<div className="grid grid-cols-4 gap-4 mb-6">
					<Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium opacity-80">Comercios</p>
									<h3 className="text-2xl font-bold mt-1">{totalBusinesses}</h3>
								</div>
								<Package className="h-8 w-8 opacity-80" />
							</div>
						</CardContent>
					</Card>
					<Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium opacity-80">Ventas Totales</p>
									<h3 className="text-2xl font-bold mt-1">{totalOrders}</h3>
								</div>
								<ShoppingCart className="h-8 w-8 opacity-80" />
							</div>
						</CardContent>
					</Card>
					<Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium opacity-80">Ingresos Totales</p>
									<h3 className="text-2xl font-bold mt-1">${totalRevenue.toFixed(2)}</h3>
								</div>
								<DollarSign className="h-8 w-8 opacity-80" />
							</div>
						</CardContent>
					</Card>
					<Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium opacity-80">Ticket Promedio</p>
									<h3 className="text-2xl font-bold mt-1">${averageOrderValue.toFixed(2)}</h3>
								</div>
								<TrendingUp className="h-8 w-8 opacity-80" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Stores */}
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">Mis Comercios</h1>
					<Link href="/stores" className="text-blue-600 hover:underline font-medium">
						Ver todos
					</Link>
				</div>

				{loading || businesses?.length === 0 ? (
					<Skeleton className="h-40 w-full" />
				) : (
					<div className="flex flex-row gap-4 justify-evenly">
						{displayedBusinesses.map((store) => (
							<BusinessCard
								key={store.id}
								id={store.id}
								name={store.name}
								category={store.category}
								logo_url={store.logo_url}
								description={store.description}
							/>
						))}
					</div>
				)}

				{/* Sales */}
				<div className="flex items-center justify-between mt-6">
					<h1 className="text-2xl font-bold">Mis ventas</h1>
					<Link href="/sales" className="text-blue-600 hover:underline font-medium">
						Ver todos
					</Link>
				</div>

				{loadingOrders ? (
					<p className="text-gray-500">Cargando ventas...</p>
				) : displayedOrders.length === 0 ? (
					<p className="text-gray-500">Aún no hay ventas registradas.</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Negocio</TableHead>
								<TableHead>Cliente</TableHead>
								<TableHead>Total</TableHead>
								<TableHead>Fecha</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{displayedOrders.map((order) => (
								<TableRow key={order.id}>
									<TableCell>{order.id}</TableCell>
									<TableCell>
										{businesses?.find((b) => b.id === order.business_id)?.name ?? order.business_id}
									</TableCell>
									<TableCell>
										{profiles?.find((p) => p.id === order.customer_id)?.full_name ?? "Desconocido"}
									</TableCell>
									<TableCell>${order.total_amount.toFixed(2)}</TableCell>
									<TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</FadeContent>
	);
}
