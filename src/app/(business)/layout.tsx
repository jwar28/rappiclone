import { RouteGuard } from "@/src/components/auth/route-guard";

export default function BusinessLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<RouteGuard allowedRoles={["business_owner", "admin"]}>
			<main>{children}</main>
		</RouteGuard>
	);
}
