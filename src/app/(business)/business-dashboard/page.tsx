"use client";

import { useEffect } from "react";
import FadeContent from "@/src/components/ui/fade-content";
import { BusinessCard } from "@/src/components/shared/business-card";
import { useBusinessStore } from "@/src/stores/business-store";
import { BusinessCardSkeleton } from "@/src/components/shared/business-card-skeleton";
import { useOrderStore } from "@/src/stores/orders-store";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/src/components/ui/table";
import { useProfileStore } from "@/src/stores/profiles-store";

export default function BusinessDashboard() {
	const { businesses, loading, error, fetchMyBusinesses } = useBusinessStore();
	const {
		fetchOrdersByBusinessId,
		orders,
		loading: loadingOrders,
	} = useOrderStore();
	const { fetchProfilesByIds, profiles } = useProfileStore();

	useEffect(() => {
		fetchMyBusinesses();
	}, [fetchMyBusinesses]);

	useEffect(() => {
		const loadOrdersForBusinesses = async () => {
			if (businesses && businesses.length > 0) {
				for (const business of businesses) {
					await fetchOrdersByBusinessId(business.id);
				}
			}
		};

		loadOrdersForBusinesses();
	}, [businesses, fetchOrdersByBusinessId]);

	useEffect(() => {
		const customerIds = orders.map((o) => o.customer_id);
		if (customerIds.length > 0) {
			fetchProfilesByIds(customerIds);
		}
	}, [orders, fetchProfilesByIds]);

	const categoriesDict = {
		restaurant: "Restaurante",
		pharmacy: "Farmacia",
		supermarket: "Supermercado",
	};

	return (
		<FadeContent duration={1500}>
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-bold">Mis Comercios</h1>

				{loading && <BusinessCardSkeleton />}
				{error && <p className="text-red-500">Error: {error}</p>}

				{!loading && businesses?.length === 0 && (
					<p className="text-gray-500">No tienes comercios registrados aún.</p>
				)}

				<div className="flex flex-row gap-4 justify-around">
					{businesses?.map((store) => (
						<BusinessCard
							key={store.id}
							id={store.id}
							name={store.name}
							category={
								categoriesDict[store.category as keyof typeof categoriesDict]
							}
							isFavorite={false}
						/>
					))}
				</div>

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
										{businesses?.find((b) => b.id === order.business_id)
											?.name ?? order.business_id}
									</TableCell>
									<TableCell>
										{profiles[order.customer_id]?.full_name ?? "Desconocido"}
									</TableCell>
									<TableCell>${order.total_amount.toFixed(2)}</TableCell>
									<TableCell>
										{new Date(order.created_at).toLocaleString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</FadeContent>
	);
}
