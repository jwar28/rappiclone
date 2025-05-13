import type { Profile } from "../types/database.types";
import { supabase } from "../utils/supabase/client";

export const getProfile = async (): Promise<Profile[]> => {
	const { data, error } = await supabase.from("profiles").select("*");

	if (error) {
		throw new Error(error.message);
	}

	return data as Profile[];
};

export const getProfileByUserId = async (userId: string): Promise<Profile[]> => {
	const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId);

	if (error) {
		throw new Error(error.message);
	}

	return data as Profile[];
};

export const fetchProfilesByIdsHelper = async (
	userIds: string[],
): Promise<Record<string, Profile>> => {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.in("id", Array.from(new Set(userIds)));

	if (error) throw new Error(error.message);

	const profileMap = data.reduce(
		(acc, profile) => {
			acc[profile.id] = profile;
			return acc;
		},
		{} as Record<string, Profile>,
	);

	return profileMap;
};
