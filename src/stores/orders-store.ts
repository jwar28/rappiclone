// stores/orderStore.ts
import { create } from "zustand";
import type { Order } from "../types/database.types";

interface OrderStore {
	orders: Order[];
	loading: boolean;
	error: string | null;
	setOrders: (orders: Order[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
	orders: [],
	loading: false,
	error: null,

	setOrders: (orders) => set({ orders }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	clearOrders: () => set({ orders: [], error: null }),
}));
