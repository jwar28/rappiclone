import { Button } from "../../ui/button";
import { Tabs } from "../../ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { NavUser } from "./nav-user";
import { useAuthStore } from "@/src/stores/auth-store";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { PlusCircleIcon } from "lucide-react";
import { AddBusinessSheet } from "@/src/components/business/AddBusinessSheet";
import { getBusinessesByOwnerId } from "@/src/api/business";
import { useBusinessStore } from "@/src/stores/business-store";
import { AddProductSheet } from "@/src/components/products/AddProductSheet";
import { getProductsByBusinessId } from "@/src/api/products";
import { useProductStore } from "@/src/stores/product-store";

export const Navbar = () => {
	const router = useRouter();
	const { user } = useAuthStore();
	const [openSheet, setOpenSheet] = useState(false);
	const [openProductSheet, setOpenProductSheet] = useState(false);
	const { businesses, setBusinesses } = useBusinessStore();
	const { setProducts } = useProductStore();

	const tabs = [
		{
			title: "Inicio",
			value: "/business-dashboard",
		},
		{
			title: "Tiendas",
			value: "/stores",
		},
		{
			title: "Ventas",
			value: "/sales",
		},
	];

	return (
		<div className="w-full bg-white shadow-sm border-b flex items-center justify-between px-4 py-2 relative">
			<h1 className="text-2xl font-bold">Rappiclone</h1>

			<div className="absolute left-1/2 -translate-x-1/2">
				<Tabs tabs={tabs} onTabChange={(value) => router.push(value)} />
			</div>

			<div className="flex flex-row gap-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="flex justify-start bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground">
							<PlusCircleIcon className="mr-2 h-4 w-4" />
							<span>Añadir</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="bottom" align="center">
						<DropdownMenuItem onClick={() => setOpenProductSheet(true)}>Producto</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setOpenSheet(true)}>Negocio</DropdownMenuItem>
						<DropdownMenuItem onClick={() => console.log("Crear orden")}>Orden</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<AddBusinessSheet
					open={openSheet}
					onOpenChange={setOpenSheet}
					onBusinessCreated={async () => {
						if (user?.id) {
							const negocios = await getBusinessesByOwnerId(user.id);
							setBusinesses(negocios);
						}
					}}
				/>

				<AddProductSheet
					trigger={null}
					open={openProductSheet}
					onOpenChange={setOpenProductSheet}
					businesses={businesses || []}
					onProductCreated={async () => {
						if (businesses) {
							const allProducts = [];
							for (const business of businesses) {
								const products = await getProductsByBusinessId(business.id);
								allProducts.push(...products);
							}
							setProducts(allProducts);
						}
					}}
				/>

				<NavUser
					user={{
						name: user?.full_name ?? null,
						email: user?.email ?? null,
						avatar: "/avatars/shadcn.jpg",
					}}
				/>
			</div>
		</div>
	);
};
