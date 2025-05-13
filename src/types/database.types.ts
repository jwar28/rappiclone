export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			businesses: {
				Row: {
					address: string;
					category: string;
					created_at: string;
					description: string | null;
					id: string;
					is_active: boolean | null;
					logo_url: string | null;
					name: string;
					owner_id: string;
					updated_at: string;
				};
				Insert: {
					address: string;
					category: string;
					created_at?: string;
					description?: string | null;
					id?: string;
					is_active?: boolean | null;
					logo_url?: string | null;
					name: string;
					owner_id: string;
					updated_at?: string;
				};
				Update: {
					address?: string;
					category?: string;
					created_at?: string;
					description?: string | null;
					id?: string;
					is_active?: boolean | null;
					logo_url?: string | null;
					name?: string;
					owner_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "businesses_owner_id_fkey";
						columns: ["owner_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			order_items: {
				Row: {
					created_at: string;
					id: string;
					order_id: string;
					product_id: string | null;
					product_name: string;
					quantity: number;
					unit_price: number;
				};
				Insert: {
					created_at?: string;
					id?: string;
					order_id: string;
					product_id?: string | null;
					product_name: string;
					quantity: number;
					unit_price: number;
				};
				Update: {
					created_at?: string;
					id?: string;
					order_id?: string;
					product_id?: string | null;
					product_name?: string;
					quantity?: number;
					unit_price?: number;
				};
				Relationships: [
					{
						foreignKeyName: "order_items_order_id_fkey";
						columns: ["order_id"];
						isOneToOne: false;
						referencedRelation: "orders";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "order_items_product_id_fkey";
						columns: ["product_id"];
						isOneToOne: false;
						referencedRelation: "products";
						referencedColumns: ["id"];
					},
				];
			};
			orders: {
				Row: {
					business_id: string | null;
					created_at: string;
					customer_id: string;
					id: string;
					shipping_address: string;
					status: string;
					total_amount: number;
					updated_at: string;
				};
				Insert: {
					business_id?: string | null;
					created_at?: string;
					customer_id: string;
					id?: string;
					shipping_address: string;
					status?: string;
					total_amount: number;
					updated_at?: string;
				};
				Update: {
					business_id?: string | null;
					created_at?: string;
					customer_id?: string;
					id?: string;
					shipping_address?: string;
					status?: string;
					total_amount?: number;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "orders_business_id_fkey";
						columns: ["business_id"];
						isOneToOne: false;
						referencedRelation: "businesses";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "orders_customer_id_fkey";
						columns: ["customer_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			products: {
				Row: {
					business_id: string;
					category: string | null;
					created_at: string;
					description: string | null;
					id: string;
					image_url: string | null;
					in_stock: boolean | null;
					name: string;
					price: number;
					updated_at: string;
				};
				Insert: {
					business_id: string;
					category?: string | null;
					created_at?: string;
					description?: string | null;
					id?: string;
					image_url?: string | null;
					in_stock?: boolean | null;
					name: string;
					price: number;
					updated_at?: string;
				};
				Update: {
					business_id?: string;
					category?: string | null;
					created_at?: string;
					description?: string | null;
					id?: string;
					image_url?: string | null;
					in_stock?: boolean | null;
					name?: string;
					price?: number;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "products_business_id_fkey";
						columns: ["business_id"];
						isOneToOne: false;
						referencedRelation: "businesses";
						referencedColumns: ["id"];
					},
				];
			};
			profiles: {
				Row: {
					address: string | null;
					created_at: string;
					email: string;
					full_name: string | null;
					id: string;
					phone: string | null;
					role: string;
					updated_at: string;
				};
				Insert: {
					address?: string | null;
					created_at?: string;
					email: string;
					full_name?: string | null;
					id: string;
					phone?: string | null;
					role?: string;
					updated_at?: string;
				};
				Update: {
					address?: string | null;
					created_at?: string;
					email?: string;
					full_name?: string | null;
					id?: string;
					phone?: string | null;
					role?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {},
	},
} as const;

export type UserRole = "admin" | "owner" | "customer";
// businesses
export type Business = Database["public"]["Tables"]["businesses"]["Row"];
export type InsertBusiness = Database["public"]["Tables"]["businesses"]["Insert"];
export type UpdateBusiness = Database["public"]["Tables"]["businesses"]["Update"];

// order_items
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type InsertOrderItem = Database["public"]["Tables"]["order_items"]["Insert"];
export type UpdateOrderItem = Database["public"]["Tables"]["order_items"]["Update"];

// orders
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type InsertOrder = Database["public"]["Tables"]["orders"]["Insert"];
export type UpdateOrder = Database["public"]["Tables"]["orders"]["Update"];

// products
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type InsertProduct = Database["public"]["Tables"]["products"]["Insert"];
export type UpdateProduct = Database["public"]["Tables"]["products"]["Update"];

// profiles
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type InsertProfile = Database["public"]["Tables"]["profiles"]["Insert"];
export type UpdateProfile = Database["public"]["Tables"]["profiles"]["Update"];
