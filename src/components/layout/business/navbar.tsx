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

export const Navbar = () => {
	const router = useRouter();
	const pathname = usePathname();
	const { user } = useAuthStore();
	const [openSheet, setOpenSheet] = useState(false);
	const { setBusinesses } = useBusinessStore();

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

	// Si estamos en una ruta que no es una tab, no mostramos ninguna como activa
	const activeTab = tabs.find((tab) => tab.value === pathname) || null;

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
						<DropdownMenuItem onClick={() => console.log("Crear producto")}>
							Producto
						</DropdownMenuItem>
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
