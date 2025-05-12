"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useBusinessStore } from "@/src/stores/business-store";
import { useProductStore } from "@/src/stores/product-store";
import { useOrderStore } from "@/src/stores/orders-store";
import { Button } from "@/src/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/src/components/ui/table";
import FadeContent from "@/src/components/ui/fade-content";

export default function StorePage() {
	const pathname = usePathname();
	const storeId = pathname.split("/").pop();
	const { businesses } = useBusinessStore();
	const { products } = useProductStore();
	const { orders } = useOrderStore();

	const handleEdit = (productId: string) => {
		console.log("Edit product:", productId);
	};

	const handleDelete = (productId: string) => {
		// Implement delete logic
	};

	const filteredProducts = products.filter((product) => product.business_id === storeId);
	const filteredOrders = orders.filter((order) => order.business_id === storeId);

	return (
		<FadeContent easing="ease-in-out" duration={500}>
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-6 text-center">
					{businesses?.find((b) => b.id === storeId)?.name || storeId}
				</h1>

				<div className="flex justify-end mb-4">
					<Button>Agregar Producto</Button>
				</div>

				<div className="flex flex-row gap-4 w-full justify-evenly">
					<div className="flex flex-col items-center">
						<h2 className="text-xl font-semibold mb-2 mt-8">Productos</h2>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nombre</TableHead>
									<TableHead>Precio</TableHead>
									<TableHead>Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredProducts.length === 0 ? (
									<TableRow>
										<TableCell colSpan={3} className="text-center text-muted-foreground">
											No hay productos registrados.
										</TableCell>
									</TableRow>
								) : (
									filteredProducts.map((product) => (
										<TableRow key={product.id}>
											<TableCell>{product.name}</TableCell>
											<TableCell>${product.price.toFixed(2)}</TableCell>
											<TableCell>
												<Button
													className="mr-4"
													variant="outline"
													onClick={() => handleEdit(product.id)}
												>
													Editar
												</Button>
												<Button variant="destructive" onClick={() => handleDelete(product.id)}>
													Eliminar
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					<div className="flex flex-col items-center">
						<h2 className="text-xl font-semibold mb-2 mt-10">Ventas</h2>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Cliente</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Fecha</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredOrders.length === 0 ? (
									<TableRow>
										<TableCell colSpan={4} className="text-center text-muted-foreground">
											No hay ventas registradas.
										</TableCell>
									</TableRow>
								) : (
									filteredOrders.map((order) => (
										<TableRow key={order.id}>
											<TableCell>{order.id}</TableCell>
											<TableCell>{order.customer_id}</TableCell>
											<TableCell>${order.total_amount.toFixed(2)}</TableCell>
											<TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</FadeContent>
	);
}
