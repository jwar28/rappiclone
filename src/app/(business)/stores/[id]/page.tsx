"use client";

import { usePathname } from "next/navigation";
import { useBusinessStore } from "@/src/stores/business-store";
import { useProductStore } from "@/src/stores/product-store";
import { useOrderStore } from "@/src/stores/orders-store";
import { useProfilesStore } from "@/src/stores/profiles-store";
import { Button } from "@/src/components/ui/button";
import { DataTable } from "@/src/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import FadeContent from "@/src/components/ui/fade-content";
import { Card, CardContent } from "@/src/components/ui/card";
import { TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react";
import { getProductsByBusinessId } from "@/src/api/products";
import { AddProductSheet } from "@/src/components/products/AddProductSheet";

export default function StorePage() {
	const pathname = usePathname();
	const storeId = pathname.split("/").pop();
	const { businesses } = useBusinessStore();
	const { products, setProducts } = useProductStore();
	const { orders } = useOrderStore();
	const { profiles } = useProfilesStore();

	const handleEdit = (productId: string) => {
		console.log("Edit product:", productId);
	};

	const handleDelete = (productId: string) => {
		// Implement delete logic
	};

	const filteredProducts = products.filter((product) => product.business_id === storeId);
	const filteredOrders = orders.filter((order) => order.business_id === storeId);

	const productColumns: ColumnDef<(typeof products)[0]>[] = [
		{
			accessorKey: "name",
			header: "Nombre",
			cell: ({ row }) => row.original.name,
			size: 120,
		},
		{
			accessorKey: "price",
			header: "Precio",
			cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
		},
		{
			header: "Acciones",
			id: "actions",
			cell: ({ row }) => (
				<div className="flex gap-2">
					<Button variant="outline" className="mr-2" onClick={() => handleEdit(row.original.id)}>
						Editar
					</Button>
					<Button variant="destructive" onClick={() => handleDelete(row.original.id)}>
						Eliminar
					</Button>
				</div>
			),
		},
	];

	const orderColumns: ColumnDef<(typeof orders)[0]>[] = [
		{
			accessorKey: "id",
			header: "ID",
			cell: ({ row }) => row.original.id,
			size: 120,
		},
		{
			header: "Cliente",
			id: "customer",
			cell: ({ row }) =>
				profiles?.find((p) => p.id === row.original.customer_id)?.full_name ?? "Desconocido",
		},
		{
			accessorKey: "total_amount",
			header: "Total",
			cell: ({ row }) => `$${row.original.total_amount.toFixed(2)}`,
		},
		{
			accessorKey: "created_at",
			header: "Fecha",
			cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
		},
	];

	const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.total_amount, 0);
	const totalProducts = filteredProducts.length;
	const totalOrders = filteredOrders.length;
	const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

	const refreshProducts = async () => {
		if (!storeId) return;
		const products = await getProductsByBusinessId(storeId);
		setProducts(products);
	};

	return (
		<FadeContent easing="ease-in-out" duration={500}>
			<div className="p-4 overflow-hidden flex flex-col">
				<div className="flex flex-row justify-between">
					<h1 className="text-2xl font-bold mb-6 text-center">
						{businesses?.find((b) => b.id === storeId)?.name || storeId}
					</h1>

					<div className="flex justify-end mb-4">
						<AddProductSheet
							trigger={<Button>Agregar Producto</Button>}
							selectedBusinessId={storeId}
							onProductCreated={refreshProducts}
						/>
					</div>
				</div>

				{/* KPI Cards Section */}
				<div className="grid grid-cols-4 gap-4 mb-6">
					<Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
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

					<Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium opacity-80">Productos</p>
									<h3 className="text-2xl font-bold mt-1">{totalProducts}</h3>
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

				<div className="flex flex-row gap-4 w-full justify-evenly flex-1 overflow-hidden">
					<div className="flex flex-col items-center w-1/2">
						<h2 className="text-xl font-semibold mb-2">Productos</h2>
						<DataTable columns={productColumns} data={filteredProducts} initialPageSize={5} />
					</div>

					<div className="flex flex-col items-center w-1/2">
						<h2 className="text-xl font-semibold mb-2">Ventas</h2>
						<DataTable columns={orderColumns} data={filteredOrders} initialPageSize={5} />
					</div>
				</div>
			</div>
		</FadeContent>
	);
}
