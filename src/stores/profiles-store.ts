// stores/profilesStore.ts
import { create } from "zustand";
import type { Profile } from "@/src/types/database.types";

interface ProfilesStore {
	profiles: Profile[];
	loading: boolean;
	error: string | null;
	setProfiles: (profiles: Profile[]) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	clearProfiles: () => void;
}

export const useProfilesStore = create<ProfilesStore>((set) => ({
	profiles: [],
	loading: false,
	error: null,

	setProfiles: (profiles) => set({ profiles }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	clearProfiles: () => set({ profiles: [], error: null }),
}));
