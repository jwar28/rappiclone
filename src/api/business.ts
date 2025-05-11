import type { Business } from "../types/database.types";
import { supabase } from "../utils/supabase/client";

export const getBusinesses = async (): Promise<Business[]> => {
	const { data, error } = await supabase.from("businesses").select("*");

	if (error) {
		throw new Error(error.message);
	}

	return data as Business[];
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
	const { data, error } = await supabase
		.from("businesses")
		.select("*")
		.eq("id", id);

	if (error) {
		throw new Error(error.message);
	}

	return data[0] as Business | null;
};

export const getBusinessesByOwnerId = async (
	ownerId: string,
): Promise<Business[]> => {
	const { data, error } = await supabase
		.from("businesses")
		.select("*")
		.eq("owner_id", ownerId);

	if (error) {
		throw new Error(error.message);
	}

	return data as Business[];
};
