"use client";

import type * as React from "react";
import {
	BadgeDollarSign,
	ChartNoAxesColumnIncreasing,
	PlusCircleIcon,
	Store,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../../ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useAuthStore } from "@/src/stores/auth-store";
import { Button } from "../../ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "../../ui/dropdown-menu";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useAuthStore();

	const data = {
		navMain: [
			{
				title: "Tiendas",
				url: "/stores",
				icon: Store,
			},
			{
				title: "Ventas",
				url: "#",
				icon: BadgeDollarSign,
			},
		],
	};

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Link href="/business-dashboard">
								<ChartNoAxesColumnIncreasing className="h-5 w-5" />
								<span className="text-xl font-semibold">Rappiclone</span>
							</Link>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="flex justify-start w-full mt-5 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground">
									<PlusCircleIcon className="mr-2 h-4 w-4" />
									<span>Crear</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="right" align="start">
								<DropdownMenuItem onClick={() => console.log("Crear producto")}>
									Producto
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => console.log("Crear negocio")}>
									Negocio
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => console.log("Crear orden")}>
									Orden
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="space-y-2">
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						name: user?.full_name ?? null,
						email: user?.email ?? null,
						avatar: "/avatars/shadcn.jpg",
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
