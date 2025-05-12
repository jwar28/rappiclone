"use client";

import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react";
import {
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../../ui/sidebar";
import { SidebarGroup } from "../../ui/sidebar";
import Link from "next/link";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<Link href={item.url}>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
