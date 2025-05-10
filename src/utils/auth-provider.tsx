"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/src/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { refreshUser } = useAuthStore();

	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	return <>{children}</>;
}
