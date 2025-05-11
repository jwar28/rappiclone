// stores/orderStore.ts
import { create } from "zustand";
import type { Order } from "../types/database.types";
import { getOrders, getOrdersByBusinessId } from "../api/orders";

interface OrderStore {
	orders: Order[];
	loading: boolean;
	error: string | null;
	fetchAllOrders: () => Promise<void>;
	fetchOrdersByBusinessId: (businessId: string) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
	orders: [],
	loading: false,
	error: null,

	fetchAllOrders: async () => {
		set({ loading: true, error: null });
		try {
			const data = await getOrders();
			set({ orders: data, loading: false });
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			set({ error: error.message, loading: false });
		}
	},

	fetchOrdersByBusinessId: async (businessId: string) => {
		set({ loading: true, error: null });
		try {
			const data = await getOrdersByBusinessId(businessId);
			set({ orders: data, loading: false });
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			set({ error: error.message, loading: false });
		}
	},
}));
