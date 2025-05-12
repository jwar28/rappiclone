import { getBusinessesByOwnerId } from "./business";
import { getProductsByBusinessId } from "./products";
import { getOrdersByBusinessId } from "./orders";
import { fetchProfilesByIdsHelper } from "./profiles";
import { useBusinessStore } from "../stores/business-store";
import { useProductStore } from "../stores/product-store";
import { useOrderStore } from "../stores/orders-store";
import { useProfilesStore } from "../stores/profiles-store";

export async function loadBusinessOwnerData(ownerId: string) {
	const businessStore = useBusinessStore.getState();
	const productStore = useProductStore.getState();
	const orderStore = useOrderStore.getState();
	const profilesStore = useProfilesStore.getState();

	try {
		// Set loading states
		businessStore.setLoading(true);
		productStore.setLoading(true);
		orderStore.setLoading(true);
		profilesStore.setLoading(true);

		// Clear previous data
		businessStore.clearBusinesses();
		productStore.clearProducts();
		orderStore.clearOrders();
		profilesStore.clearProfiles();

		// Fetch businesses
		const businesses = await getBusinessesByOwnerId(ownerId);
		businessStore.setBusinesses(businesses);

		// Fetch products for each business
		const allProducts = await Promise.all(
			businesses.map((business) => getProductsByBusinessId(business.id)),
		);
		const flattenedProducts = allProducts.flat();
		productStore.setProducts(flattenedProducts);

		// Fetch orders for each business
		const allOrders = await Promise.all(
			businesses.map((business) => getOrdersByBusinessId(business.id)),
		);
		const flattenedOrders = allOrders.flat();
		orderStore.setOrders(flattenedOrders);

		// Get unique customer IDs from orders
		const customerIds = Array.from(new Set(flattenedOrders.map((order) => order.customer_id)));

		// Fetch customer profiles
		if (customerIds.length > 0) {
			const customerProfiles = await fetchProfilesByIdsHelper(customerIds);
			profilesStore.setProfiles(Object.values(customerProfiles));
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "An error occurred";
		businessStore.setError(errorMessage);
		productStore.setError(errorMessage);
		orderStore.setError(errorMessage);
		profilesStore.setError(errorMessage);
	} finally {
		// Reset loading states
		businessStore.setLoading(false);
		productStore.setLoading(false);
		orderStore.setLoading(false);
		profilesStore.setLoading(false);
	}
}
