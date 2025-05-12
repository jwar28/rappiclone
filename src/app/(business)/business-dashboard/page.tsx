"use client";

import FadeContent from "@/src/components/ui/fade-content";
import { BusinessCard } from "@/src/components/shared/business-card";
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

	return (
		<FadeContent easing="ease-in-out" duration={500}>
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-bold">Mis Comercios</h1>

				{loading || businesses?.length === 0 ? (
					<Skeleton className="h-40 w-full" />
				) : (
					<div className="flex flex-row gap-4 justify-around">
						{businesses?.map((store) => (
							<Link key={store.id} href={`/stores/${store.id}`}>
								<BusinessCard
									id={store.id}
									name={store.name}
									category={categoriesDict[store.category as keyof typeof categoriesDict]}
									isFavorite={false}
								/>
							</Link>
						))}
					</div>
				)}

				<h1 className="text-2xl font-bold">Mis venta</h1>
				{loadingOrders ? (
					<p className="text-gray-500">Cargando ventas...</p>
				) : orders.length === 0 ? (
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
							{orders.map((order) => (
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
