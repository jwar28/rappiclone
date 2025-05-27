import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/database.types";

interface CartItem extends Product {
	quantity: number;
}

interface CartStore {
	items: CartItem[];
	addItem: (product: Product) => void;
	removeItem: (productId: string) => void;
	clearCart: () => void;
	getTotal: () => number;
	getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],
			addItem: (product: Product) => {
				set((state) => {
					const existingItem = state.items.find((item) => item.id === product.id);
					if (existingItem) {
						return {
							items: state.items.map((item) =>
								item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
							),
						};
					}
					return { items: [...state.items, { ...product, quantity: 1 }] };
				});
			},
			removeItem: (productId: string) => {
				set((state) => {
					const existingItem = state.items.find((item) => item.id === productId);
					if (existingItem && existingItem.quantity > 1) {
						return {
							items: state.items.map((item) =>
								item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
							),
						};
					}
					return { items: state.items.filter((item) => item.id !== productId) };
				});
			},
			clearCart: () => set({ items: [] }),
			getTotal: () => {
				const state = get();
				return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
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
