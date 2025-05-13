import type React from "react";
import { useState, useEffect } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { updateBusiness } from "@/src/api/business";
import type { Business, UpdateBusiness } from "@/src/types/database.types";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const CATEGORIES = [
	{ value: "restaurant", label: "Restaurante" },
	{ value: "pharmacy", label: "Farmacia" },
	{ value: "supermarket", label: "Supermercado" },
];

interface EditBusinessSheetProps {
	business: Business;
	trigger?: React.ReactNode;
	onBusinessUpdated?: () => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function EditBusinessSheet({
	business,
	trigger,
	onBusinessUpdated,
	open: controlledOpen,
	onOpenChange,
}: EditBusinessSheetProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const setOpen = onOpenChange || setInternalOpen;
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		name: business.name,
		description: business.description || "",
		category: business.category,
		address: business.address,
		logo_url: business.logo_url || "",
		is_active: business.is_active ?? true,
	});

	useEffect(() => {
		setForm({
			name: business.name,
			description: business.description || "",
			category: business.category,
			address: business.address,
			logo_url: business.logo_url || "",
			is_active: business.is_active ?? true,
		});
	}, [business]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const businessUpdate: UpdateBusiness = {
				name: form.name,
				description: form.description || null,
				category: form.category,
				address: form.address,
				logo_url: form.logo_url || null,
				is_active: form.is_active,
			};
			await updateBusiness(business.id, businessUpdate);
			toast.success("Negocio actualizado exitosamente");
			if (onBusinessUpdated) onBusinessUpdated();
			setOpen(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Error al actualizar el negocio");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
			<SheetContent side="right" className="w-full max-w-md">
				<SheetHeader>
					<SheetTitle>Editar negocio</SheetTitle>
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
					<div className="flex items-center space-x-2">
						<Switch
							id="is_active"
							checked={form.is_active}
							onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
						/>
						<Label htmlFor="is_active">Negocio activo</Label>
					</div>
					<Button type="submit" disabled={loading}>
						{loading ? "Actualizando..." : "Actualizar negocio"}
					</Button>
				</form>
			</SheetContent>
		</Sheet>
	);
}
