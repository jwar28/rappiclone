import { RouteGuard } from "@/src/components/auth/route-guard";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
	return (
		<RouteGuard allowedRoles={["customer", "admin", "owner"]}>
			<main>{children}</main>
		</RouteGuard>
	);
}
