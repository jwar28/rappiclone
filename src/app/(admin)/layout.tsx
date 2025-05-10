import { RouteGuard } from "@/src/components/auth/route-guard";

export default function AdminLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<RouteGuard allowedRoles={["admin"]}>
			<main>{children}</main>
		</RouteGuard>
	);
}
