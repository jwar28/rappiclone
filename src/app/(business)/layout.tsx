"use client";

import { AuthRedirectGuard } from "@/src/components/auth/auth-redirect-guard";
import { RouteGuard } from "@/src/components/auth/route-guard";
import { AppSidebar } from "@/src/components/layout/business/sidebar";
import { SiteHeader } from "@/src/components/layout/business/site-header";
import FadeContent from "@/src/components/ui/fade-content";
import { SidebarProvider, SidebarInset } from "@/src/components/ui/sidebar";

export default function BusinessLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<RouteGuard allowedRoles={["business_owner", "admin"]}>
			<AuthRedirectGuard />
			<FadeContent>
				<SidebarProvider>
					<AppSidebar variant="inset" />
					<SidebarInset>
						<SiteHeader />
						<div className="p-4">{children}</div>
					</SidebarInset>
				</SidebarProvider>
			</FadeContent>
		</RouteGuard>
	);
}
