"use client";

import { useBusinessStore } from "@/src/stores/business-store";
import FadeContent from "@/src/components/ui/fade-content";
import { Skeleton } from "@/src/components/ui/skeleton";
import AnimatedList from "@/src/components/ui/animated-list";
import { useRouter } from "next/navigation";

export default function StoresPage() {
	const router = useRouter();
	const { businesses, loading, error } = useBusinessStore();

	const categoriesDict = {
		restaurant: "Restaurante",
		pharmacy: "Farmacia",
		supermarket: "Supermercado",
	};

	return (
		<FadeContent easing="ease-in-out" duration={500}>
			<div className="flex flex-col gap-4">
				<h1 className="text-2xl font-bold">Mis Comercios</h1>

				{loading && businesses?.length === 0 && <Skeleton className="h-40 w-full" />}
				{error && <p className="text-red-500">Error: {error}</p>}

				{!loading && businesses?.length === 0 && (
					<p className="text-gray-500">No tienes comercios registrados aún.</p>
				)}

				<AnimatedList
					items={businesses?.map((store) => store.name) || []}
					onItemSelect={(item, index) => {
						router.push(`/stores/${businesses?.[index].id}`);
					}}
					showGradients={false}
					enableArrowNavigation={true}
					displayScrollbar={true}
				/>
			</div>
		</FadeContent>
	);
}
