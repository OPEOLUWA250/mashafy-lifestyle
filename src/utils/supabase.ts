import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if Supabase is configured
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Simple cache for products (5 minute TTL)
let cachedProducts: any[] | null = null;
let cacheTtl = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour (increased from 5 minutes)

// Load cache from localStorage on startup
const loadCacheFromStorage = () => {
  try {
    const stored = localStorage.getItem("mashafy_products_cache");
    if (stored) {
      const { data, ttl } = JSON.parse(stored);
      if (Date.now() < ttl) {
        cachedProducts = data;
        cacheTtl = ttl;
        console.log("Loaded products from localStorage cache");
        return true;
      }
    }
  } catch (e) {
    console.warn("Failed to load cache from localStorage");
  }
  return false;
};

// Save cache to localStorage
const saveCacheToStorage = (data: any[]) => {
  try {
    localStorage.setItem(
      "mashafy_products_cache",
      JSON.stringify({
        data,
        ttl: cacheTtl,
      }),
    );
  } catch (e) {
    console.warn("Failed to save cache to localStorage");
  }
};

// Try to load from localStorage on module load
loadCacheFromStorage();

// Type definitions
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: "tees" | "journals";
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: CartItem[];
  total_price: number;
  shipping_cost: number;
  tax: number;
  final_total: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  created_at: string;
  notes?: string;
}

// Mock sample orders
const MOCK_ORDERS: Order[] = [
  {
    id: "mock-001",
    customer_name: "Chioma Okonkwo",
    customer_email: "chioma@example.com",
    customer_phone: "+2348012345678",
    items: [
      {
        id: "1",
        name: "I Dare to Stand Out",
        price: 8500,
        quantity: 2,
        category: "tees",
        selectedSize: "L",
        selectedColor: "#000000",
      },
    ],
    total_price: 17000,
    shipping_cost: 2000,
    tax: 1425,
    final_total: 20425,
    status: "processing",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-002",
    customer_name: "Taiwo Adeleke",
    customer_email: "taiwo@example.com",
    customer_phone: "+2348087654321",
    items: [
      {
        id: "4",
        name: "Mashafy Reflection Journal",
        price: 12000,
        quantity: 1,
        category: "journals",
      },
    ],
    total_price: 12000,
    shipping_cost: 2000,
    tax: 1050,
    final_total: 15050,
    status: "pending",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mock-003",
    customer_name: "Amara Nwankwo",
    customer_email: "amara@example.com",
    customer_phone: "+2348134567890",
    items: [
      {
        id: "2",
        name: "Ambitious and Anointed",
        price: 8500,
        quantity: 1,
        category: "tees",
        selectedSize: "S",
        selectedColor: "#FFFFFF",
      },
    ],
    total_price: 8500,
    shipping_cost: 2000,
    tax: 788,
    final_total: 11288,
    status: "delivered",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Database operations
export const saveOrder = async (order: Omit<Order, "id" | "created_at">) => {
  try {
    if (!isSupabaseConfigured) {
      console.log("ℹ️ Supabase not configured. Order saved to console:", order);
      return {
        data: {
          ...order,
          id: "local-" + Date.now(),
          created_at: new Date().toISOString(),
        },
        error: null,
      };
    }

    if (!supabase) return { data: null, error: "Supabase not initialized" };

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone,
          items: order.items,
          total_price: order.total_price,
          shipping_cost: order.shipping_cost,
          tax: order.tax,
          final_total: order.final_total,
          status: order.status,
          notes: order.notes,
        },
      ])
      .select();

    return { data, error };
  } catch (error) {
    console.error("Error saving order:", error);
    return { data: null, error };
  }
};

export const getOrders = async () => {
  try {
    if (!isSupabaseConfigured) {
      console.log("ℹ️ Supabase not configured. Using mock data.");
      return { data: MOCK_ORDERS, error: null };
    }

    if (!supabase) return { data: MOCK_ORDERS, error: null };

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    return { data: data || MOCK_ORDERS, error };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { data: MOCK_ORDERS, error };
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"],
) => {
  try {
    if (!isSupabaseConfigured) {
      console.log(
        `ℹ️ Supabase not configured. Order ${orderId} status would be updated to: ${status}`,
      );
      return { data: { id: orderId, status }, error: null };
    }

    if (!supabase) return { data: null, error: "Supabase not initialized" };

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select();

    return { data, error };
  } catch (error) {
    console.error("Error updating order:", error);
    return { data: null, error };
  }
};

// Mock products data
export const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "I Dare to Stand Out",
    description: "Unisex minimalist typography tee with universal appeal",
    price: 8500,
    category: "tees",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    colors: ["#000000", "#FFFFFF", "#8B4513"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    in_stock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Ambitious and Anointed",
    description: "Female-cut empowering tee for the bold visionary",
    price: 8500,
    category: "tees",
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=500&fit=crop",
    colors: ["#000000", "#FFFFFF"],
    sizes: ["XS", "S", "M", "L", "XL"],
    in_stock: true,
    featured: true,
  },
  {
    id: "3",
    name: "Fierce and Fearless",
    description: "Bold statement tee for those who dare differently",
    price: 8500,
    category: "tees",
    image:
      "https://images.unsplash.com/photo-1503341320519-c92dcca89b13?w=500&h=500&fit=crop",
    colors: ["#8B0000", "#000000", "#FFFFFF"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    in_stock: true,
    featured: true,
  },
  {
    id: "4",
    name: "Mashafy Reflection Journal",
    description: "Premium journal for intentional living and daily clarity",
    price: 12000,
    category: "journals",
    image:
      "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop",
    colors: ["#8B4513", "#000000"],
    in_stock: true,
    featured: true,
  },
];

// Product operations
export const getProducts = async () => {
  try {
    if (!isSupabaseConfigured) {
      console.log("ℹ️ Supabase not configured. Using mock products.");
      return { data: MOCK_PRODUCTS, error: null };
    }

    if (!supabase) {
      console.warn("⚠️ Supabase client not initialized");
      return { data: MOCK_PRODUCTS, error: "Supabase not initialized" };
    }

    // Check memory cache first
    if (cachedProducts && Date.now() < cacheTtl) {
      console.log("✓ Using cached products from memory");
      return { data: cachedProducts, error: null };
    }

    console.log("🔄 Fetching products from Supabase...");
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, category, stock, image_url, created_at")
      .order("created_at", { ascending: false })
      .limit(50); // Limit to 50 products for faster loading

    if (error) {
      console.error("❌ Supabase error:", error);
      return { data: null, error: error.message };
    }

    if (!data) {
      console.warn("⚠️ No data returned from Supabase");
      return { data: [], error: "No data returned" };
    }

    // Update caches even if empty - this indicates database is empty, not an error
    cachedProducts = data;
    cacheTtl = Date.now() + CACHE_DURATION;
    saveCacheToStorage(data);

    console.log(`✓ Successfully fetched ${data.length} products from Supabase`);
    return { data, error: null };
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Function to clear product cache (call after adding/editing product)
export const clearProductCache = () => {
  console.log("Clearing product cache");
  cachedProducts = null;
  cacheTtl = 0;
  try {
    localStorage.removeItem("mashafy_products_cache");
  } catch (e) {
    console.warn("Failed to clear localStorage cache");
  }
};

export const createProduct = async (product: any) => {
  try {
    if (!isSupabaseConfigured) {
      console.log(
        "ℹ️ Supabase not configured. Product would be created:",
        product,
      );
      return { data: { ...product, id: "local-" + Date.now() }, error: null };
    }

    if (!supabase) return { data: null, error: "Supabase not initialized" };

    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select();

    if (error) {
      console.error("Error creating product in Supabase:", error);
      return { data: null, error: error.message || error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const updateProduct = async (productId: string, updates: any) => {
  try {
    if (!isSupabaseConfigured) {
      console.log(
        `ℹ️ Supabase not configured. Product ${productId} would be updated:`,
        updates,
      );
      return { data: { id: productId, ...updates }, error: null };
    }

    if (!supabase) return { data: null, error: "Supabase not initialized" };

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId)
      .select();

    if (error) {
      console.error("Error updating product in Supabase:", error);
      return { data: null, error: error.message || error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    if (!isSupabaseConfigured) {
      console.log(
        `ℹ️ Supabase not configured. Product ${productId} would be deleted`,
      );
      return { data: { id: productId }, error: null };
    }

    if (!supabase) return { data: null, error: "Supabase not initialized" };

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Error deleting product in Supabase:", error);
      return { data: null, error: error.message || error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Stock and order_items management
export const checkProductStock = async (
  productId: string,
  quantity: number,
) => {
  try {
    if (!isSupabaseConfigured) {
      console.log(
        `ℹ️ Stock check: Product ${productId} - Quantity: ${quantity}`,
      );
      return { available: true, error: null };
    }

    if (!supabase)
      return { available: false, error: "Supabase not initialized" };

    const { data, error } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error checking stock:", error);
      return { available: false, error };
    }

    const available = (data?.stock || 0) >= quantity;
    return { available, error: null };
  } catch (error) {
    console.error("Error checking stock:", error);
    return { available: false, error };
  }
};

export const decrementProductStock = async (
  productId: string,
  quantity: number,
) => {
  try {
    if (!isSupabaseConfigured) {
      console.log(
        `ℹ️ Stock decrement: Product ${productId} - Quantity: ${quantity}`,
      );
      return { data: { id: productId }, error: null };
    }

    if (!supabase) return { data: null, error: "Supabase not initialized" };

    const { data, error } = await supabase.rpc("decrement_stock", {
      product_id: productId,
      quantity,
    });

    if (error) {
      console.error("Error decrementing stock:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error decrementing stock:", error);
    return { data: null, error };
  }
};
