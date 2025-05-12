"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useBusinessStore } from "@/src/stores/business-store";
import { useProductStore } from "@/src/stores/product-store";
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

	const handleEdit = (productId: string) => {
		// Implement edit logic
		console.log("Edit product:", productId);
	};

	const handleDelete = (productId: string) => {
		// Implement delete logic
		// setProducts(products.filter((product) => product.id !== productId));
	};

	const filteredProducts = products.filter((product) => product.business_id === storeId);

	return (
		<FadeContent easing="ease-in-out" duration={500}>
			<div className="p-4">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">{businesses?.[0]?.name || storeId}</h1>
					<Button>Add Product</Button>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredProducts.map((product) => (
							<TableRow key={product.id}>
								<TableCell>{product.name}</TableCell>
								<TableCell>${product.price.toFixed(2)}</TableCell>
								<TableCell>
									<Button className="mr-4" variant="outline" onClick={() => handleEdit(product.id)}>
										Edit
									</Button>
									<Button variant="destructive" onClick={() => handleDelete(product.id)}>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</FadeContent>
	);
}
