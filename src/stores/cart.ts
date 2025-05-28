import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/database.types";

export interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image_url?: string;
	businessId: string;
	businessName: string;
}

interface CartStore {
	items: CartItem[];
	addItem: (item: CartItem) => void;
	removeItem: (itemId: string) => void;
	clearCart: () => void;
	getTotal: () => number;
	getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],
			addItem: (item) => {
				set((state) => {
					const existingItem = state.items.find((i) => i.id === item.id);
					if (existingItem) {
						return {
							items: state.items.map((i) =>
								i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
							),
						};
					}
					return { items: [...state.items, { ...item, quantity: 1 }] };
				});
			},
			removeItem: (itemId) => {
				set((state) => ({
					items: state.items
						.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item))
						.filter((item) => item.quantity > 0),
				}));
			},
			clearCart: () => set({ items: [] }),
			getTotal: () => {
				const { items } = get();
				return items.reduce((total, item) => total + item.price * item.quantity, 0);
			},
			getItemCount: () => {
				const state = get();
				return state.items.reduce((total, item) => total + item.quantity, 0);
			},
		}),
		{
			name: "cart-storage",
		},
	),
);
