// business-store.ts
import { create } from "zustand";
import type { Business } from "../types/database.types";

type BusinessStore = {
	businesses: Business[] | null;
	loading: boolean;
	error: string | null;
	setBusinesses: (data: Business[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	clearBusinesses: () => void;
};

export const useBusinessStore = create<BusinessStore>((set) => ({
	businesses: null,
	loading: false,
	error: null,

	setBusinesses: (data) => set({ businesses: data }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	clearBusinesses: () => set({ businesses: null }),
}));
