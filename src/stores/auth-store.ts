import { create } from "zustand";
import getCurrentProfile, { supabase } from "../utils/supabase/client";
import type { Profile } from "../types/database.types";

type AuthStore = {
	user: Profile | null;
	loading: boolean;
	isAuthenticated: boolean;
	refreshUser: () => Promise<Profile | null>;
	logout: () => Promise<void>;
	setUser: (profile: Profile | null) => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
	user: null,
	loading: true,
	isAuthenticated: false,

	refreshUser: async () => {
		try {
			const profile = await getCurrentProfile();
			set({ user: profile, loading: false });
			return profile;
		} catch (err) {
			set({ user: null, loading: false });
			return null;
		}
	},

	logout: async () => {
		await supabase.auth.signOut();
		set({ user: null, isAuthenticated: false });
	},

	setUser: (profile) => {
		set({ user: profile, isAuthenticated: !!profile });
	},
}));
