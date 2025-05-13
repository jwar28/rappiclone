import type React from "react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { toast } from "sonner";
import { updateProduct } from "@/src/api/products";
import type { Product } from "@/src/types/database.types";

const CATEGORIES = [
	{ value: "food", label: "Comida" },
	{ value: "drink", label: "Bebida" },
	{ value: "dessert", label: "Postre" },
	{ value: "other", label: "Otro" },
];

interface EditProductSheetProps {
	product: Product;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onProductUpdated?: () => void;
}

export function EditProductSheet({
	product,
	open,
	onOpenChange,
	onProductUpdated,
}: EditProductSheetProps) {
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		name: product.name,
		description: product.description || "",
		price: product.price.toString(),
		image_url: product.image_url || "",
		category: product.category || CATEGORIES[0].value,
		in_stock: product.in_stock ?? true,
	});

	useEffect(() => {
		setForm({
			name: product.name,
			description: product.description || "",
			price: product.price.toString(),
			image_url: product.image_url || "",
			category: product.category || CATEGORIES[0].value,
			in_stock: product.in_stock ?? true,
		});
	}, [product]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.name || !form.price) {
			toast.error("Completa los campos requeridos");
			return;
		}
		setLoading(true);
		try {
			await updateProduct(product.id, {
				name: form.name,
				description: form.description || null,
				price: Number.parseFloat(form.price),
				image_url: form.image_url || null,
				category: form.category,
				in_stock: form.in_stock,
				business_id: product.business_id,
			});
			toast.success("Producto actualizado exitosamente");
			onOpenChange(false);
			if (onProductUpdated) onProductUpdated();
		} catch (err) {
			toast.error("Error al actualizar el producto");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Editar Producto</SheetTitle>
				</SheetHeader>
				<form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
					<div>
						<Label>Nombre</Label>
						<Input
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							required
							disabled={loading}
						/>
					</div>
					<div>
						<Label>Descripción</Label>
						<Textarea
							value={form.description}
							onChange={(e) => setForm({ ...form, description: e.target.value })}
							disabled={loading}
						/>
					</div>
					<div>
						<Label>Precio</Label>
						<Input
							type="number"
							min="0"
							step="0.01"
							value={form.price}
							onChange={(e) => setForm({ ...form, price: e.target.value })}
							required
							disabled={loading}
						/>
					</div>
					<div>
						<Label>URL de la imagen</Label>
						<Input
							type="url"
							value={form.image_url}
							onChange={(e) => setForm({ ...form, image_url: e.target.value })}
							placeholder="https://ejemplo.com/imagen.jpg"
							disabled={loading}
						/>
					</div>
					<div>
						<Label>Categoría</Label>
						<Select
							value={form.category}
							onValueChange={(value) => setForm({ ...form, category: value })}
							disabled={loading}
						>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona una categoría" />
							</SelectTrigger>
							<SelectContent>
								{CATEGORIES.map((cat) => (
									<SelectItem key={cat.value} value={cat.value}>
										{cat.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center space-x-2">
						<Switch
							id="in-stock"
							checked={form.in_stock}
							onCheckedChange={(checked) => setForm({ ...form, in_stock: checked })}
							disabled={loading}
						/>
						<Label htmlFor="in-stock">En stock</Label>
					</div>
					<Button type="submit" disabled={loading}>
						{loading ? "Actualizando..." : "Actualizar"}
					</Button>
				</form>
			</SheetContent>
		</Sheet>
	);
}
