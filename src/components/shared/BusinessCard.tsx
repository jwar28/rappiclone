import type React from "react";
import Link from "next/link";

interface BusinessCardProps {
	id: string;
	name: string;
	category: string;
	logo_url?: string | null;
	description?: string | null;
}

const categoriesDict: Record<string, string> = {
	restaurant: "Restaurante",
	pharmacy: "Farmacia",
	supermarket: "Supermercado",
};

export const BusinessCard: React.FC<BusinessCardProps> = ({
	id,
	name,
	category,
	logo_url,
	description,
}) => {
	return (
		<Link href={`/stores/${id}`} className="block h-full">
			<div className="flex flex-row items-center gap-4 p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:bg-gray-50 cursor-pointer w-full h-40">
				<img
					src={logo_url || "/placeholder-store.png"}
					alt={name}
					className="w-16 h-16 object-cover rounded-full shadow bg-gray-100 flex-shrink-0"
				/>
				<div className="flex flex-col min-w-0 justify-center">
					<span className="text-lg font-semibold truncate">{name}</span>
					<span className="text-sm text-gray-500 mb-1">{categoriesDict[category] || category}</span>
					{description && (
						<span className="text-sm text-gray-700 truncate max-w-xs">{description}</span>
					)}
				</div>
			</div>
		</Link>
	);
};
