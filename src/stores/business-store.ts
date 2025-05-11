// src/store/businessStore.ts
import { create } from "zustand";
import type { Business } from "../types/database.types";
import { getBusinesses, getBusinessesByOwnerId } from "../api/business";
import { useAuthStore } from "./auth-store";

type BusinessStore = {
	businesses: Business[] | null;
	loading: boolean;
	error: string | null;
	fetchBusinesses: () => Promise<void>;
	fetchMyBusinesses: () => Promise<void>;
};

export const useBusinessStore = create<BusinessStore>((set) => ({
	businesses: null,
	loading: false,
	error: null,

	fetchBusinesses: async () => {
		set({ loading: true, error: null });
		try {
			const data = await getBusinesses();
			set({ businesses: data, loading: false });
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (err: any) {
			set({ error: err.message, loading: false });
		}
	},

	fetchMyBusinesses: async () => {
		set({ loading: true, error: null });
		const user = useAuthStore.getState().user;

		if (!user) {
			set({
				businesses: null,
				loading: false,
				error: "Usuario no autenticado",
			});
			return;
		}

		try {
			const data = await getBusinessesByOwnerId(user.id);
			set({ businesses: data, loading: false });
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (err: any) {
			set({ error: err.message, loading: false });
		}
	},
}));
