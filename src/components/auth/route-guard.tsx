"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/stores/auth-store";
import type { UserRole } from "@/src/types/database.types";

type RouteGuardProps = {
	children: React.ReactNode;
	allowedRoles: UserRole[];
	redirectTo?: string;
};

export function RouteGuard({ children, allowedRoles, redirectTo = "/signin" }: RouteGuardProps) {
	const { user, loading } = useAuthStore();
	const router = useRouter();
	const [authorized, setAuthorized] = useState(false);

	useEffect(() => {
		if (loading) return;

		if (!user) {
			router.replace(redirectTo);
			return;
		}

		if (!allowedRoles.includes(user.role as UserRole)) {
			switch (user.role) {
				case "admin":
					router.replace("/admin-dashboard");
					break;
				case "owner":
					router.replace("/business-dashboard");
					break;
				default:
					router.replace("/");
					break;
			}
			return;
		}

		setAuthorized(true);
	}, [loading, user, router, allowedRoles, redirectTo]);

	if (loading || !authorized) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
					<p className="mt-3">Cargando...</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
