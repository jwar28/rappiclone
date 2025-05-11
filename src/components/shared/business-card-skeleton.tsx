import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

export function BusinessCardSkeleton() {
	return (
		<Card className="overflow-hidden w-full max-w-xs border shadow-sm">
			<div className="relative">
				{/* Image skeleton */}
				<Skeleton className="w-full h-40 object-cover" />
				{/* Favorite button skeleton */}
				<div className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm">
					<Skeleton className="h-5 w-5 rounded-full" />
				</div>
				{/* Promotion badge skeleton */}
				<Badge className="absolute bottom-2 left-2 bg-orange-500">
					<Skeleton className="h-4 w-16 rounded" />
				</Badge>
			</div>
			<CardContent className="p-3">
				<div className="space-y-2">
					<div className="flex justify-between items-start">
						<Skeleton className="h-5 w-32 rounded" />
						<div className="flex items-center gap-1 text-sm">
							<Skeleton className="h-4 w-4 rounded" />
							<Skeleton className="h-4 w-8 rounded" />
						</div>
					</div>
					<Skeleton className="h-4 w-20 rounded" />
					<div className="flex items-center gap-3 text-xs">
						<div className="flex items-center gap-1">
							<Skeleton className="h-3.5 w-3.5 rounded" />
							<Skeleton className="h-3 w-10 rounded" />
						</div>
						<div className="flex items-center gap-1">
							<Skeleton className="h-3.5 w-3.5 rounded" />
							<Skeleton className="h-3 w-10 rounded" />
						</div>
						<div className="ml-auto font-medium">
							<Skeleton className="h-4 w-12 rounded" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
