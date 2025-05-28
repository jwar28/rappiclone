"use client";

import { EyeIcon, LogOutIcon, MoreVerticalIcon, UserCircleIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { useAuthStore } from "@/src/stores/auth-store";
import { getInitials } from "@/src/utils/utils";
import { useRouter } from "next/navigation";

export function NavUser({
	user,
}: {
	user: {
		name: string | null;
		email: string | null;
		avatar: string | null;
	};
}) {
	const { logout, user: authUser } = useAuthStore();
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button type="button" className="flex items-center gap-2 rounded-lg p-1 hover:bg-accent">
					<Avatar className="h-8 w-8 rounded-lg grayscale">
						<AvatarImage src={user.avatar ?? undefined} alt={user.name ?? undefined} />
						<AvatarFallback className="rounded-lg">{getInitials(user.name ?? "")}</AvatarFallback>
					</Avatar>
					<div className="hidden md:grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{user.name}</span>
						<span className="truncate text-xs text-muted-foreground">{user.email}</span>
					</div>
					<MoreVerticalIcon className="ml-auto size-4" />
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage src={user.avatar ?? undefined} alt={user.name ?? undefined} />
							<AvatarFallback className="rounded-lg">{getInitials(user.name ?? "")}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{user.name}</span>
							<span className="truncate text-xs text-muted-foreground">{user.email}</span>
						</div>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{authUser?.role !== "customer" && (
					<>
						<DropdownMenuGroup>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<EyeIcon />
									Ver como
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="min-w-36">
									<DropdownMenuItem onClick={() => router.push("/admin-dashboard")}>
										Administrador
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => router.push("/home")}>Cliente</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />
					</>
				)}

				<DropdownMenuItem onClick={logout}>
					<LogOutIcon />
					Cerrar sesión
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
