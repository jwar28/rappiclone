"use client";

import { useBusinessStore } from "@/src/stores/business-store";
import FadeContent from "@/src/components/ui/fade-content";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AddBusinessSheet } from "@/src/components/business/AddBusinessSheet";
import { getBusinessesByOwnerId } from "@/src/api/business";
import { useAuthStore } from "@/src/stores/auth-store";

export default function StoresPage() {
	const router = useRouter();
	const { businesses, loading, error, setBusinesses } = useBusinessStore();
	const { user } = useAuthStore();

	const categoriesDict = {
		restaurant: "Restaurante",
		pharmacy: "Farmacia",
		supermarket: "Supermercado",
	};

	const handleEdit = (id: string) => {
		router.push(`/stores/${id}/edit`);
	};

	const handleDelete = (id: string) => {
		// Aquí deberías mostrar confirmación y luego eliminar
		if (window.confirm("¿Seguro que deseas eliminar este comercio?")) {
			// Lógica para eliminar el comercio
			console.log("Eliminar comercio", id);
		}
	};

	const handleCreate = () => {
		router.push("/stores/create");
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
								const negocios = await getBusinessesByOwnerId(user.id);
								setBusinesses(negocios);
							}
						}}
					/>
				</div>

				{loading && businesses?.length === 0 && <Skeleton className="h-40 w-full" />}
				{error && <p className="text-red-500">Error: {error}</p>}

				{!loading && businesses?.length === 0 && (
					<p className="text-gray-500">No tienes comercios registrados aún.</p>
				)}

				<div className="grid gap-4">
					{businesses?.map((store) => (
						<Card
							key={store.id}
							className="shadow-lg hover:shadow-xl transition-shadow border-0 rounded-xl p-0 overflow-hidden"
						>
							<Link
								href={`/stores/${store.id}`}
								className="block w-full h-full focus:outline-none"
								tabIndex={-1}
							>
								<CardContent className="flex flex-row items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
									<div className="flex items-center gap-4">
										<img
											src={store.logo_url || "/placeholder-store.png"}
											alt={store.name}
											className="w-16 h-16 object-cover rounded-full shadow bg-gray-100"
										/>
										<div>
											<h2 className="text-lg font-bold mb-1">{store.name}</h2>
											<p className="text-sm text-gray-500">
												{categoriesDict[store.category as keyof typeof categoriesDict]}
											</p>
										</div>
									</div>
									<div className="flex gap-2 z-10">
										<Button
											variant="outline"
											size="icon"
											onClick={(e) => {
												e.stopPropagation();
												e.preventDefault();
												handleEdit(store.id);
											}}
											title="Editar"
										>
											<Pencil className="w-4 h-4" />
										</Button>
										<Button
											variant="destructive"
											size="icon"
											onClick={(e) => {
												e.stopPropagation();
												e.preventDefault();
												handleDelete(store.id);
											}}
											title="Eliminar"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</CardContent>
							</Link>
						</Card>
					))}
				</div>
			</div>
		</FadeContent>
	);
}
