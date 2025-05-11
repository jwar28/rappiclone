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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useAuthStore();

	const data = {
		navMain: [
			{
				title: "Negocios",
				url: "#",
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
							<a href="/">
								<ChartNoAxesColumnIncreasing className="h-5 w-5" />
								<span className="text-xl font-semibold">Rappiclone</span>
							</a>
						</SidebarMenuButton>
						<SidebarMenuButton
							tooltip="Crear"
							className="min-w-8 mt-6 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
						>
							<PlusCircleIcon />
							<span>Crear</span>
						</SidebarMenuButton>
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
