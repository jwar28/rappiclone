// stores/productStore.ts
import { create } from "zustand";
import type { Product } from "@/src/types/database.types";

interface ProductStore {
	products: Product[];
	loading: boolean;
	error: string | null;
	setProducts: (products: Product[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	clearProducts: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
	products: [],
	loading: false,
	error: null,

	setProducts: (products) => set({ products }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	clearProducts: () => set({ products: [], error: null }),
}));
