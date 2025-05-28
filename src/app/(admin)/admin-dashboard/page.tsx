"use client";

import { DataTable } from "@/src/components/ui/data-table";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { NavUser } from "@/src/components/business/nav-user";
import { useAuthStore } from "@/src/stores/auth-store";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile, editProfile, deleteProfile } from "@/src/api/profiles";
import { getBusinesses, updateBusiness, deleteBusiness } from "@/src/api/business";
import type { Profile, Business } from "@/src/types/database.types";
import { useProfilesStore } from "@/src/stores/profiles-store";
import { useBusinessStore } from "@/src/stores/business-store";
import { toast } from "sonner";

// Simple Modal Component
const Modal = ({
	isOpen,
	onClose,
	title,
	children,
}: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">{title}</h2>
					<button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
						×
					</button>
				</div>
				{children}
			</div>
		</div>
	);
};

export default function AdminDashboard() {
	const { user } = useAuthStore();
	const { profiles, setProfiles, loading: profilesLoading } = useProfilesStore();
	const { businesses, setBusinesses, loading: businessesLoading } = useBusinessStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [editingUser, setEditingUser] = useState<Profile | null>(null);
	const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
	const [editedUserData, setEditedUserData] = useState<Partial<Profile>>({});
	const [editedBusinessData, setEditedBusinessData] = useState<Partial<Business>>({});

	// Reset edited data when modal closes
	useEffect(() => {
		if (!isUserModalOpen) {
			setEditedUserData({});
		}
		if (!isBusinessModalOpen) {
			setEditedBusinessData({});
		}
	}, [isUserModalOpen, isBusinessModalOpen]);

	// Update edited data when editing user/business changes
	useEffect(() => {
		if (editingUser) {
			setEditedUserData(editingUser);
		}
		if (editingBusiness) {
			setEditedBusinessData(editingBusiness);
		}
	}, [editingUser, editingBusiness]);

	// Fetch data
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [profilesData, businessesData] = await Promise.all([getProfile(), getBusinesses()]);
				setProfiles(profilesData);
				setBusinesses(businessesData);
			} catch (error) {
				toast.error("Error al cargar los datos");
				console.error(error);
			}
		};

		fetchData();
	}, [setProfiles, setBusinesses]);

	// Filter data based on search
	const filteredUsers = profiles.filter(
		(user) =>
			user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const filteredBusinesses = (businesses || []).filter(
		(business) =>
			business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			business.category.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Handle user updates
	const handleUserUpdate = async () => {
		if (!editingUser || !editedUserData) return;
		try {
			const updatedUser = { ...editingUser, ...editedUserData };
			await editProfile(updatedUser);
			setProfiles(profiles.map((p) => (p.id === updatedUser.id ? updatedUser : p)));
			toast.success("Usuario actualizado correctamente");
			setIsUserModalOpen(false);
			setEditingUser(null);
		} catch (error) {
			toast.error("Error al actualizar el usuario");
			console.error(error);
		}
	};

	// Handle business updates
	const handleBusinessUpdate = async () => {
		if (!editingBusiness || !editedBusinessData || !businesses) return;
		try {
			const updatedBusiness = { ...editingBusiness, ...editedBusinessData };
			await updateBusiness(updatedBusiness.id, updatedBusiness);
			setBusinesses(businesses.map((b) => (b.id === updatedBusiness.id ? updatedBusiness : b)));
			toast.success("Negocio actualizado correctamente");
			setIsBusinessModalOpen(false);
			setEditingBusiness(null);
		} catch (error) {
			toast.error("Error al actualizar el negocio");
			console.error(error);
		}
	};

	// Handle user deletion
	const handleUserDelete = async (userId: string) => {
		try {
			const userToDelete = profiles.find((p) => p.id === userId);
			if (userToDelete) {
				await deleteProfile(userToDelete);
				setProfiles(profiles.filter((p) => p.id !== userId));
				toast.success("Usuario eliminado correctamente");
			}
		} catch (error) {
			toast.error("Error al eliminar el usuario");
			console.error(error);
		}
	};

	// Handle business deletion
	const handleBusinessDelete = async (businessId: string) => {
		if (!businesses) return;
		try {
			await deleteBusiness(businessId);
			setBusinesses(businesses.filter((b) => b.id !== businessId));
			toast.success("Negocio eliminado correctamente");
		} catch (error) {
			toast.error("Error al eliminar el negocio");
			console.error(error);
		}
	};

	const getRoleLabel = (role: string) => {
		switch (role) {
			case "customer":
				return "Cliente";
			case "business_owner":
				return "Dueño de Negocio";
			case "admin":
				return "Administrador";
			default:
				return role;
		}
	};

	const getStatusBadge = (status: string) => {
		const variants = {
			active: "default",
			pending: "secondary",
			inactive: "outline",
		} as const;

		return (
			<Badge
				variant={variants[status as keyof typeof variants] || "default"}
				className={status === "active" ? "bg-green-500 text-white" : ""}
			>
				{status === "active" ? "Activo" : status === "pending" ? "Pendiente" : "Inactivo"}
			</Badge>
		);
	};

	const userColumns = [
		{ header: "Nombre", accessorKey: "full_name" },
		{ header: "Email", accessorKey: "email" },
		{
			header: "Rol",
			accessorKey: "role",
			cell: ({ row }: { row: { original: Profile } }) => getRoleLabel(row.original.role),
		},
		{
			header: "Acciones",
			cell: ({ row }: { row: { original: Profile } }) => (
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setEditingUser(row.original);
							setIsUserModalOpen(true);
						}}
					>
						Editar
					</Button>
				</div>
			),
		},
	];

	const businessColumns = [
		{ header: "Nombre", accessorKey: "name" },
		{ header: "Categoría", accessorKey: "category" },
		{ header: "Dirección", accessorKey: "address" },
		{
			header: "Estado",
			accessorKey: "is_active",
			cell: ({ row }: { row: { original: Business } }) =>
				getStatusBadge(row.original.is_active ? "active" : "inactive"),
		},
		{
			header: "Acciones",
			cell: ({ row }: { row: { original: Business } }) => (
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setEditingBusiness(row.original);
							setIsBusinessModalOpen(true);
						}}
					>
						Editar
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm sticky top-0 z-50">
				<div className="max-w-9xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-green-600">Rappiclone</h1>
						<div className="relative flex-1 max-w-xl mx-4">
							<input
								type="text"
								placeholder="Buscar usuarios, negocios..."
								className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
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

			<main className="container mx-auto p-6 space-y-6">
				<div className="flex justify-between items-center">
					<h2 className="text-3xl font-bold">Panel de Administración</h2>
				</div>

				<Card className="p-6">
					<Tabs defaultValue="users" className="space-y-4">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="users">Usuarios</TabsTrigger>
							<TabsTrigger value="businesses">Negocios</TabsTrigger>
						</TabsList>

						<TabsContent value="users" className="space-y-4">
							<div className="flex justify-between items-center">
								<h3 className="text-2xl font-semibold">Gestión de Usuarios</h3>
								<Button>Agregar Usuario</Button>
							</div>
							<DataTable columns={userColumns} data={filteredUsers} />
						</TabsContent>

						<TabsContent value="businesses" className="space-y-4">
							<div className="flex justify-between items-center">
								<h3 className="text-2xl font-semibold">Gestión de Negocios</h3>
								<Button>Agregar Negocio</Button>
							</div>
							<DataTable columns={businessColumns} data={filteredBusinesses} />
						</TabsContent>
					</Tabs>
				</Card>
			</main>

			{/* User Edit Modal */}
			<Modal
				isOpen={isUserModalOpen}
				onClose={() => {
					setIsUserModalOpen(false);
					setEditingUser(null);
				}}
				title="Editar Usuario"
			>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Nombre</Label>
						<Input
							id="name"
							value={editedUserData.full_name || ""}
							onChange={(e) =>
								setEditedUserData((prev) => ({ ...prev, full_name: e.target.value }))
							}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							value={editedUserData.email || ""}
							onChange={(e) => setEditedUserData((prev) => ({ ...prev, email: e.target.value }))}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="role">Rol</Label>
						<Select
							value={editedUserData.role}
							onValueChange={(value) => setEditedUserData((prev) => ({ ...prev, role: value }))}
						>
							<SelectTrigger>
								<SelectValue placeholder="Seleccionar rol" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="customer">Cliente</SelectItem>
								<SelectItem value="business_owner">Dueño de Negocio</SelectItem>
								<SelectItem value="admin">Administrador</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex gap-2">
						<Button onClick={handleUserUpdate} disabled={!editingUser}>
							Guardar Cambios
						</Button>
						<Button
							variant="destructive"
							onClick={() => editingUser && handleUserDelete(editingUser.id)}
						>
							Eliminar
						</Button>
					</div>
				</div>
			</Modal>

			{/* Business Edit Modal */}
			<Modal
				isOpen={isBusinessModalOpen}
				onClose={() => {
					setIsBusinessModalOpen(false);
					setEditingBusiness(null);
				}}
				title="Editar Negocio"
			>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Nombre del Negocio</Label>
						<Input
							id="name"
							value={editedBusinessData.name || ""}
							onChange={(e) => setEditedBusinessData((prev) => ({ ...prev, name: e.target.value }))}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="category">Categoría</Label>
						<Input
							id="category"
							value={editedBusinessData.category || ""}
							onChange={(e) =>
								setEditedBusinessData((prev) => ({ ...prev, category: e.target.value }))
							}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="address">Dirección</Label>
						<Input
							id="address"
							value={editedBusinessData.address || ""}
							onChange={(e) =>
								setEditedBusinessData((prev) => ({ ...prev, address: e.target.value }))
							}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="is_active">Estado</Label>
						<Select
							value={editedBusinessData.is_active ? "active" : "inactive"}
							onValueChange={(value) =>
								setEditedBusinessData((prev) => ({
									...prev,
									is_active: value === "active",
								}))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Seleccionar estado" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="active">Activo</SelectItem>
								<SelectItem value="inactive">Inactivo</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex gap-2">
						<Button onClick={handleBusinessUpdate} disabled={!editingBusiness}>
							Guardar Cambios
						</Button>
						<Button
							variant="destructive"
							onClick={() => editingBusiness && handleBusinessDelete(editingBusiness.id)}
						>
							Eliminar
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
