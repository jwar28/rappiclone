import type { Database, Profile } from "@/src/types/database.types";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
	createBrowserClient<Database>(
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);

export const supabase = createClient();

const client = createClient();

export default async function getCurrentProfile(): Promise<Profile | null> {
	try {
		const {
			data: { user },
		} = await client.auth.getUser();

		if (!user) return null;

		const { data: profile } = await client.from("profiles").select("*").eq("id", user.id).single();

		return profile as Profile;
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return null;
	}
}

export async function updateProfile(
	profile: Partial<Profile>,
): Promise<{ success: boolean; error?: string }> {
	try {
		const {
			data: { user },
		} = await client.auth.getUser();

		if (!user) return { success: false, error: "No user logged in" };

		const { error } = await client.from("profiles").update(profile).eq("id", user.id);

		if (error) throw error;

		return { success: true };
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.error("Error updating profile:", error);
		return { success: false, error: error.message };
	}
}

export async function signUp(
	email: string,
	password: string,
	role: Profile["role"] = "customer",
): Promise<{ success: boolean; error?: string }> {
	try {
		const { data, error } = await client.auth.signUp({
			email,
			password,
		});

		if (error) throw error;

		if (role !== "customer" && data.user?.id) {
			await client.from("profiles").update({ role }).eq("id", data.user.id);
		}

		return { success: true };
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.error("Error signing up:", error);
		return { success: false, error: error.message };
	}
}

export async function signIn(
	email: string,
	password: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const { error } = await client.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw error;

		return { success: true };
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.error("Error signing in:", error);
		return { success: false, error: error.message };
	}
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
	try {
		const { error } = await client.auth.signOut();

		if (error) throw error;

		return { success: true };
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.error("Error signing out:", error);
		return { success: false, error: error.message };
	}
}
