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
import { Label } from "@/src/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { toast } from "sonner";
import { addProduct } from "@/src/api/products";

interface Business {
	id: string;
	name: string;
}

interface AddProductSheetProps {
	trigger: React.ReactNode;
	businesses?: Business[];
	selectedBusinessId?: string;
	onProductCreated?: () => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function AddProductSheet({
	trigger,
	businesses,
	selectedBusinessId,
	onProductCreated,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
}: AddProductSheetProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const setOpen = controlledOnOpenChange || setInternalOpen;
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [businessId, setBusinessId] = useState(selectedBusinessId || "");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !price || !(businessId || selectedBusinessId)) {
			toast.error("Completa todos los campos");
			return;
		}
		setLoading(true);
		try {
			await addProduct({
				name,
				price: Number.parseFloat(price),
				business_id: selectedBusinessId || businessId,
				image_url: imageUrl || null,
			});
			toast.success("Producto creado exitosamente");
			setOpen(false);
			setName("");
			setPrice("");
			setImageUrl("");
			if (onProductCreated) onProductCreated();
		} catch (err) {
			toast.error("Error al crear el producto");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>{trigger}</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Agregar Producto</SheetTitle>
				</SheetHeader>
				<form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
					<div>
						<Label>Nombre</Label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							disabled={loading}
						/>
					</div>
					<div>
						<Label>Precio</Label>
						<Input
							type="number"
							min="0"
							step="0.01"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							required
							disabled={loading}
						/>
					</div>
					<div>
						<Label>URL de la imagen (opcional)</Label>
						<Input
							type="url"
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							placeholder="https://ejemplo.com/imagen.jpg"
							disabled={loading}
						/>
					</div>
					{selectedBusinessId ? null : (
						<div>
							<Label>Negocio</Label>
							<Select value={businessId} onValueChange={setBusinessId} required disabled={loading}>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona un negocio" />
								</SelectTrigger>
								<SelectContent>
									{businesses?.map((b) => (
										<SelectItem key={b.id} value={b.id}>
											{b.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
					<Button type="submit" disabled={loading}>
						{loading ? "Agregando..." : "Agregar"}
					</Button>
				</form>
			</SheetContent>
		</Sheet>
	);
}
