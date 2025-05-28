import type { Order, InsertOrder, InsertOrderItem } from "../types/database.types";
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

export const addOrder = async (order: {
	id: string;
	items: Array<{
		id: string;
		name: string;
		quantity: number;
		price: number;
		image_url?: string;
	}>;
	total: number;
	status: "pending" | "preparing" | "delivering" | "delivered";
	createdAt: Date;
	estimatedDeliveryTime?: Date;
	businessId: string;
	businessName: string;
	shippingAddress: string;
}) => {
	try {
		// Get the current user
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError) {
			throw new Error(`Error getting user: ${userError.message}`);
		}

		if (!user) {
			throw new Error("User must be authenticated to place an order");
		}

		// Format the order data for Supabase
		const orderData: InsertOrder = {
			id: order.id,
			business_id: order.businessId,
			customer_id: user.id,
			shipping_address: order.shippingAddress,
			status: order.status,
			total_amount: order.total,
			created_at: order.createdAt.toISOString(),
			updated_at: new Date().toISOString(),
		};

		// Insert the order
		const { data: orderResult, error: orderError } = await supabase
			.from("orders")
			.insert(orderData)
			.select()
			.single();

		if (orderError) {
			console.error("Error creating order:", orderError);
			throw new Error(`Error creating order: ${orderError.message}`);
		}

		// Create order items
		const orderItems: InsertOrderItem[] = order.items.map((item) => ({
			order_id: order.id,
			product_id: item.id,
			product_name: item.name,
			quantity: item.quantity,
			unit_price: item.price,
			created_at: new Date().toISOString(),
		}));

		const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

		if (itemsError) {
			console.error("Error creating order items:", itemsError);
			// If items creation fails, we should delete the order
			await supabase.from("orders").delete().eq("id", order.id);
			throw new Error(`Error creating order items: ${itemsError.message}`);
		}

		return orderResult;
	} catch (error) {
		console.error("Error in addOrder:", error);
		throw error;
	}
};

export const trackActiveOrder = async (orderId: string) => {
	const { data, error } = await supabase
		.from("orders")
		.select("*")
		.eq("id", orderId)
		.eq("status", "pending");

	if (error) {
		throw new Error(error.message);
	}

	return data;
};
