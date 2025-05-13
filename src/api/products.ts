import { supabase } from "../utils/supabase/client";
import type { InsertProduct, Product } from "../types/database.types";
import { useProductStore } from "../stores/product-store";

export const getProducts = async (): Promise<Product[]> => {
	const { data, error } = await supabase.from("products").select("*");
	if (error) throw error;
	return data as Product[];
};

export const getProductsByBusinessId = async (businessId: string): Promise<Product[]> => {
	const { data, error } = await supabase.from("products").select("*").eq("business_id", businessId);
	if (error) throw error;
	return data as Product[];
};

export const getBusinessIdByName = async (businessName: string): Promise<string> => {
	const { data, error } = await supabase.from("businesses").select("id").eq("name", businessName);
	if (error) throw error;
	return data[0].id;
};

export const getProductsByBusinessName = async (businessName: string): Promise<Product[]> => {
	const businessId = await getBusinessIdByName(businessName);
	const products = await getProductsByBusinessId(businessId);
	return products;
};

export const addProduct = async (product: InsertProduct): Promise<Product> => {
	const { data, error } = await supabase.from("products").insert(product).select().single();
	if (error) throw error;
	return data as Product;
};
