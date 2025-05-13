"use client";

import { AuthRedirectGuard } from "@/src/components/auth/auth-redirect-guard";
import { RouteGuard } from "@/src/components/auth/route-guard";
import { Navbar } from "@/src/components/business/navbar";
import FadeContent from "@/src/components/ui/fade-content";
import { Toaster } from "@/src/components/ui/sonner";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
	return (
		<RouteGuard allowedRoles={["business_owner", "admin"]}>
			<AuthRedirectGuard />
			<FadeContent>
				<Navbar />
				<div className="p-4">{children}</div>
				<Toaster />
			</FadeContent>
		</RouteGuard>
	);
}
