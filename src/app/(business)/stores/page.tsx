"use client";

import { useBusinessStore } from "@/src/stores/business-store";
import FadeContent from "@/src/components/ui/fade-content";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AddBusinessSheet } from "@/src/components/business/add-business-sheet";
import { EditBusinessSheet } from "@/src/components/business/edit-business-sheet";
import { getBusinessesByOwnerId, deleteBusiness } from "@/src/api/business";
import { useAuthStore } from "@/src/stores/auth-store";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { useState } from "react";
import type { Business } from "@/src/types/database.types";

export default function StoresPage() {
	const router = useRouter();
	const { businesses, loading, error, setBusinesses } = useBusinessStore();
	const { user } = useAuthStore();
	const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

	const categoriesDict = {
		restaurant: "Restaurante",
		pharmacy: "Farmacia",
		supermarket: "Supermercado",
	};

	const refreshBusinesses = async () => {
		const stores = await getBusinessesByOwnerId(user?.id || "");
		setBusinesses(stores);
	};

	const handleEdit = (business: Business) => {
		setEditingBusiness(business);
	};

	const handleDelete = async (businessId: string) => {
		await deleteBusiness(businessId);
		refreshBusinesses();
	};

	return (
		<FadeContent easing="ease-in-out" duration={500}>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold">Mis Comercios</h1>
					<AddBusinessSheet
						trigger={
							<Button className="flex gap-2 items-center">
								<Plus className="w-4 h-4" /> Crear nuevo comercio
							</Button>
						}
						onBusinessCreated={async () => {
							if (user?.id) {
								refreshBusinesses();
							}
						}}
					/>
				</div>

				{loading && businesses?.length === 0 && <Skeleton className="h-40 w-full" />}
				{error && <p className="text-red-500">Error: {error}</p>}

				{!loading && businesses?.length === 0 && (
					<p className="text-gray-500">No tienes comercios registrados aún.</p>
				)}

				{!loading && businesses && businesses.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{businesses.map((business) => (
							<Card key={business.id}>
								<CardContent className="p-4">
									<div className="flex justify-between items-start">
										<Link
											href={`/stores/${business.id}`}
											className="flex items-center gap-3 flex-1 focus:outline-none"
											tabIndex={-1}
										>
											<img
												src={business.logo_url || "/placeholder-store.png"}
												alt={business.name}
												className="w-12 h-12 object-cover rounded-full shadow bg-gray-100"
											/>
											<div>
												<h3 className="font-semibold text-lg">{business.name}</h3>
												<p className="text-sm text-gray-500">
													{categoriesDict[business.category as keyof typeof categoriesDict]}
												</p>
											</div>
										</Link>
										<div className="flex gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={(e) => {
													e.stopPropagation();
													e.preventDefault();
													handleEdit(business);
												}}
											>
												<Pencil className="w-4 h-4" />
											</Button>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button variant="ghost" size="icon">
														<Trash2 className="w-4 h-4" />
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>
															¿Estás seguro de eliminar este comercio?
														</AlertDialogTitle>
														<AlertDialogDescription>
															Esta acción no se puede deshacer.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancelar</AlertDialogCancel>
														<AlertDialogAction onClick={() => handleDelete(business.id)}>
															Eliminar
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}

				{editingBusiness && (
					<EditBusinessSheet
						business={editingBusiness}
						open={!!editingBusiness}
						onOpenChange={(open) => !open && setEditingBusiness(null)}
						onBusinessUpdated={refreshBusinesses}
					/>
				)}
			</div>
		</FadeContent>
	);
}
