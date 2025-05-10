import { createClient } from "@/src/utils/supabase/server";
import type { Business } from "../types/database.types";

const supabase = createClient();

export async function getBusinesses(): Promise<Business[]> {
	const { data, error } = await (await supabase).from("businesses").select("*");

	if (error) {
		throw new Error(error.message);
	}

	return data as Business[];
}

export async function getBusinessById(id: string): Promise<Business | null> {
	const { data, error } = await (await supabase)
		.from("businesses")
		.select("*")
		.eq("id", id);

	if (error) {
		throw new Error(error.message);
	}

	return data[0] as Business | null;
}
