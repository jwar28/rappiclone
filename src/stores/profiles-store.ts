// stores/profile-store.ts
import { create } from "zustand";
import type { Profile } from "../types/database.types";
import {
	fetchProfilesByIdsHelper,
	getProfile,
	getProfileByUserId,
} from "../api/profiles";

interface ProfileStore {
	profiles: Record<string, Profile>;
	loading: boolean;
	error: string | null;
	fetchAllProfiles: () => Promise<void>;
	fetchProfileByUserId: (userId: string) => Promise<void>;
	fetchProfilesByIds: (userIds: string[]) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
	profiles: {},
	loading: false,
	error: null,

	fetchAllProfiles: async () => {
		set({ loading: true, error: null });
		try {
			const data = await getProfile();
			set({
				profiles: data.reduce(
					(acc, profile) => {
						acc[profile.id] = profile;
						return acc;
					},
					{} as Record<string, Profile>,
				),
				loading: false,
			});
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			set({ error: error.message, loading: false });
		}
	},

	fetchProfileByUserId: async (userId: string) => {
		set({ loading: true, error: null });
		try {
			const data = await getProfileByUserId(userId);
			set({
				profiles: { [data[0].id]: data[0] },
				loading: false,
			});
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			set({ error: error.message, loading: false });
		}
	},

	fetchProfilesByIds: async (userIds: string[]) => {
		const uniqueIds = Array.from(new Set(userIds));
		const existing = get().profiles;
		const missingIds = uniqueIds.filter((id) => !existing[id]);

		if (missingIds.length === 0) return;

		set({ loading: true, error: null });

		try {
			const newProfiles = await fetchProfilesByIdsHelper(missingIds);
			set({
				profiles: { ...existing, ...newProfiles },
				loading: false,
			});
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (err: any) {
			set({ error: err.message, loading: false });
		}
	},
}));
