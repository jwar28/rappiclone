import type React from "react";
import { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { addBusiness } from "@/src/api/business";
import { useAuthStore } from "@/src/stores/auth-store";
import type { InsertBusiness } from "@/src/types/database.types";
import { Textarea } from "../ui/textarea";

const CATEGORIES = [
	{ value: "restaurant", label: "Restaurante" },
	{ value: "pharmacy", label: "Farmacia" },
	{ value: "supermarket", label: "Supermercado" },
];

export function AddBusinessSheet({
	trigger,
	onBusinessCreated,
	open: controlledOpen,
	onOpenChange,
}: {
	trigger?: React.ReactNode;
	onBusinessCreated?: () => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const { user } = useAuthStore();
	const [internalOpen, setInternalOpen] = useState(false);
	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const setOpen = onOpenChange || setInternalOpen;
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		name: "",
		description: "",
		category: CATEGORIES[0].value,
		address: "",
		logo_url: "",
	});
	const [error, setError] = useState<string | null>(null);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			if (!user?.id) throw new Error("Usuario no autenticado");
			const business: InsertBusiness = {
				name: form.name,
				description: form.description || null,
				category: form.category,
				address: form.address,
				logo_url: form.logo_url || null,
				owner_id: user.id,
			};
			await addBusiness(business);
			if (onBusinessCreated) onBusinessCreated();
			setOpen(false);
			setForm({
				name: "",
				description: "",
				category: CATEGORIES[0].value,
				address: "",
				logo_url: "",
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al crear el negocio");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent side="right" className="w-full max-w-md">
				<SheetHeader>
					<SheetTitle>Crear nuevo negocio</SheetTitle>
				</SheetHeader>
				<form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
					<Input
						name="name"
						placeholder="Nombre del negocio"
						value={form.name}
						onChange={handleChange}
						required
					/>
					<Textarea
						name="description"
						placeholder="Descripción"
						value={form.description}
						onChange={handleChange}
					/>
					<select
						name="category"
						value={form.category}
						onChange={handleChange}
						className="border rounded p-2"
						required
					>
						{CATEGORIES.map((cat) => (
							<option key={cat.value} value={cat.value}>
								{cat.label}
							</option>
						))}
					</select>
					<Input
						name="address"
						placeholder="Dirección"
						value={form.address}
						onChange={handleChange}
						required
					/>
					<Input
						name="logo_url"
						placeholder="URL del logo (opcional)"
						value={form.logo_url}
						onChange={handleChange}
					/>
					{error && <div className="text-red-500 text-sm">{error}</div>}
					<Button type="submit" disabled={loading}>
						{loading ? "Creando..." : "Crear negocio"}
					</Button>
				</form>
			</SheetContent>
		</Sheet>
	);
}
