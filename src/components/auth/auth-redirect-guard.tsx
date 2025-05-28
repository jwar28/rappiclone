"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/src/stores/auth-store";

export function AuthRedirectGuard() {
	const router = useRouter();
	const pathname = usePathname();
	const { refreshUser } = useAuthStore();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const init = async () => {
			const profile = await refreshUser();

			if (!profile) {
				if (pathname !== "/signin") router.push("/signin");
			} else {
				if (pathname === "/" || pathname === "/signin" || pathname === "/signup") {
					switch (profile.role) {
						case "admin":
							router.push("/admin-dashboard");
							break;
						case "business_owner":
							router.push("/business-dashboard");
							break;
						default:
							router.push("/home");
					}
				}
			}
		};

		init();
	}, [pathname, router]);

	return null;
}
