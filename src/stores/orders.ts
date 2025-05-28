import { create } from "zustand";

export type OrderStatus = "pending" | "preparing" | "delivering" | "delivered";

export interface Order {
	id: string;
	items: Array<{
		id: string;
		name: string;
		quantity: number;
		price: number;
		image_url?: string;
	}>;
	total: number;
	status: OrderStatus;
	createdAt: Date;
	estimatedDeliveryTime?: Date;
	businessId: string;
	businessName: string;
}

interface OrdersStore {
	orders: Order[];
	addOrder: (order: Order) => void;
	updateOrderStatus: (orderId: string, status: OrderStatus) => void;
	getActiveOrders: () => Order[];
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
	orders: [],
	addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
	updateOrderStatus: (orderId, status) =>
		set((state) => ({
			orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
		})),
	getActiveOrders: () => {
		const { orders } = get();
		return orders.filter((order) => order.status === "pending");
	},
}));
