"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Star, Clock, MapPin, Badge } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface StoreCardProps {
	id: string;
	name: string;
	image?: string;
	category?: string;
	rating?: number;
	deliveryTime?: string;
	distance?: string;
	deliveryCost?: string;
	hasPromotion?: boolean;
	promotionText?: string;
	isFavorite?: boolean;
}

export function BusinessCard({
	id,
	name,
	image,
	category,
	rating,
	deliveryTime,
	distance,
	deliveryCost,
	hasPromotion = false,
	promotionText = "",
	isFavorite = false,
}: StoreCardProps) {
	const [favorite, setFavorite] = useState(isFavorite);

	return (
		<Card className="overflow-hidden w-full max-w-xs border shadow-sm hover:shadow-md transition-shadow">
			<div className="relative">
				<Image
					src={image || "/placeholder.svg"}
					alt={name}
					width={320}
					height={160}
					className="w-full h-40 object-cover"
				/>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
				<button
					onClick={() => setFavorite(!favorite)}
					className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm"
					aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
				>
					<Heart
						className={`h-5 w-5 ${favorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
					/>
				</button>
				{hasPromotion && (
					<Badge className="absolute bottom-2 left-2 bg-orange-500 hover:bg-orange-600">
						{promotionText}
					</Badge>
				)}
			</div>
			<CardContent className="p-3">
				<div className="space-y-2">
					<div className="flex justify-between items-start">
						<h3 className="font-semibold text-base line-clamp-1">{name}</h3>
						<div className="flex items-center gap-1 text-sm">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							<span>{rating?.toFixed(1)}</span>
						</div>
					</div>
					<p className="text-sm text-gray-500">{category}</p>
					<div className="flex items-center gap-3 text-xs text-gray-500">
						<div className="flex items-center gap-1">
							<Clock className="h-3.5 w-3.5" />
							<span>{deliveryTime}</span>
						</div>
						<div className="flex items-center gap-1">
							<MapPin className="h-3.5 w-3.5" />
							<span>{distance}</span>
						</div>
						<div className="ml-auto font-medium text-gray-700">
							{deliveryCost === "Gratis" ? (
								<span className="text-green-600">{deliveryCost}</span>
							) : (
								deliveryCost
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
