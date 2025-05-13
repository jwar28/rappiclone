import type { Order } from "../types/database.types";
import { supabase } from "../utils/supabase/client";

export const getOrders = async (): Promise<Order[]> => {
	const { data, error } = await supabase.from("orders").select("*");

	if (error) {
		throw new Error(error.message);
	}

	return data as Order[];
};

export const getOrdersByBusinessId = async (businessId: string): Promise<Order[]> => {
	const { data, error } = await supabase.from("orders").select("*").eq("business_id", businessId);

	if (error) {
		throw new Error(error.message);
	}

	return data as Order[];
};
