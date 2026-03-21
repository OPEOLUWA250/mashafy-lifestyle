import { createClient } from "@supabase/supabase-js";
import { logAdminAction } from "./secureAuth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

let cachedProducts: any[] | null = null;
let cacheTtl = 0;
const CACHE_DURATION = 60 * 60 * 1000;

const loadCacheFromStorage = () => {
  try {
    const stored = localStorage.getItem("mashafy_products_cache");
    if (stored) {
      const { data, ttl } = JSON.parse(stored);
      if (Date.now() < ttl) {
        cachedProducts = data;
        cacheTtl = ttl;
        return true;
      }
    }
  } catch (e) {
    console.warn("Failed to load cache");
  }
  return false;
};

const saveCacheToStorage = (data: any[]) => {
  try {
    localStorage.setItem("mashafy_products_cache", JSON.stringify({ data, ttl: cacheTtl }));
  } catch (e) {
    console.warn("Failed to save cache");
  }
};

loadCacheFromStorage();

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: "tees" | "journals";
  selectedSize?: string;
  selectedColor?: string;
}

export const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "I Dare to Stand Out",
    description: "Unisex minimalist typography tee with universal appeal",
    price: 8500,
    category: "tees",
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
  },
  {
    id: "2",
    name: "Ambitious and Anointed",
    description: "Female-cut empowering tee for the bold visionary",
    price: 8500,
    category: "tees",
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=500&fit=crop",
  },
  {
    id: "3",
    name: "Fierce and Fearless",
    description: "Bold statement tee for those who dare differently",
    price: 8500,
    category: "tees",
    stock: 35,
    image_url: "https://images.unsplash.com/photo-1503341320519-c92dcca89b13?w=500&h=500&fit=crop",
  },
  {
    id: "4",
    name: "Mashafy Reflection Journal",
    description: "Premium journal for intentional living and daily clarity",
    price: 12000,
    category: "journals",
    stock: 20,
    image_url: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop",
  },
];

// Deletion tracking
const getDeletedIds = (): string[] => {
  try {
    const stored = localStorage.getItem("mashafy_deleted_products");
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const saveDeletedIds = (ids: string[]) => {
  try {
    localStorage.setItem("mashafy_deleted_products", JSON.stringify(ids));
  } catch (e) {
    console.warn("Failed to save deleted IDs");
  }
};

// Sync event
const triggerSync = () => {
  window.dispatchEvent(new CustomEvent("mashafy-products-changed"));
};

// Local products
const getLocalProducts = (): any[] => {
  try {
    const stored = localStorage.getItem("mashafy_local_products");
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalProducts = (products: any[]) => {
  try {
    // Prevent duplicates: keep only latest version of each ID
    const idMap = new Map();
    products.forEach(p => {
      if (p.id) {
        idMap.set(p.id, p); // Latest one wins
      }
    });
    const unique = Array.from(idMap.values());
    localStorage.setItem("mashafy_local_products", JSON.stringify(unique));
    console.log("💾 Saved local products (deduplicated):", unique.length, "products");
  } catch (e) {
    console.warn("Failed to save local products");
  }
};

// Get products
export const getProducts = async () => {
  try {
    const deletedIds = getDeletedIds();
    const local = getLocalProducts();
    
    console.log("🔍 getProducts called:");
    console.log("  📦 Deleted IDs:", deletedIds);
    console.log("  💾 Local products from storage:", local.length, "items");

    if (!isSupabaseConfigured || !supabase) {
      console.log("  ⚠️  Offline mode: returning ONLY local products");
      const filtered = local.filter(p => !deletedIds.includes(p.id));
      console.log("  ✅ Offline: returning", filtered.length, "products");
      return { data: filtered, error: null };
    }

    if (cachedProducts && Date.now() < cacheTtl) {
      const localIds = new Set(local.map(p => p.id));
      const filtered = cachedProducts
        .filter((p: any) => !deletedIds.includes(p.id) && !localIds.has(p.id));
      const combined = [...filtered, ...local];
      console.log("  ✅ Cached mode: returning", combined.length, "products (no MOCK)");
      return { data: combined, error: null };
    }

    console.log("  🌐 Fetching from Supabase...");
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, category, stock, image_url, created_at");

    console.log("  📡 Supabase response:", error ? "ERROR" : "OK", "fetched", data?.length || 0, "products");

    if (error) {
      console.log("  ⚠️  Supabase error: returning ONLY local products");
      const filtered = local.filter(p => !deletedIds.includes(p.id));
      console.log("  ✅ Fallback: returning", filtered.length, "products");
      return { data: filtered, error: null };
    }

    if (!data || data.length === 0) {
      console.log("  ⚠️  Supabase empty: returning ONLY local products");
      const filtered = local.filter(p => !deletedIds.includes(p.id));
      console.log("  ✅ Fallback: returning", filtered.length, "products");
      return { data: filtered, error: null };
    }

    cachedProducts = data;
    cacheTtl = Date.now() + CACHE_DURATION;
    saveCacheToStorage(data);

    const localIds = new Set(local.map(p => p.id));
    const filtered = data
      .filter((p: any) => !deletedIds.includes(p.id) && !localIds.has(p.id));
    const combined = [...filtered, ...local];
    console.log("  ✅ Supabase success: returning", combined.length, "products (no MOCK fallback)");
    return { data: combined, error: null };
  } catch (error) {
    const deletedIds = getDeletedIds();
    const local = getLocalProducts();
    console.log("  ❌ Error in getProducts, returning ONLY local products");
    const filtered = local.filter(p => !deletedIds.includes(p.id));
    console.log("  ✅ Fallback: returning", filtered.length, "products");
    return { data: filtered, error: null };
  }
};

export const clearProductCache = () => {
  cachedProducts = null;
  cacheTtl = 0;
  try {
    localStorage.removeItem("mashafy_products_cache");
  } catch (e) {
    console.warn("Failed to clear cache");
  }
  triggerSync();
};

export const createProduct = async (product: any) => {
  try {
    if (!isSupabaseConfigured || !supabase) {
      const newProduct = {
        ...product,
        id: "local-" + Date.now(),
        created_at: new Date().toISOString(),
      };
      const local = getLocalProducts();
      local.push(newProduct);
      saveLocalProducts(local);
      clearProductCache();
      logAdminAction("product_created", { id: newProduct.id, name: product.name }, "success");
      return { data: newProduct, error: null };
    }

    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select();

    if (error) {
      const newProduct = {
        ...product,
        id: "local-" + Date.now(),
        created_at: new Date().toISOString(),
      };
      const local = getLocalProducts();
      local.push(newProduct);
      saveLocalProducts(local);
      clearProductCache();
      logAdminAction("product_created", { id: newProduct.id, name: product.name }, "success");
      return { data: newProduct, error: null };
    }

    clearProductCache();
    logAdminAction("product_created", { id: data?.[0]?.id, name: product.name }, "success");
    return { data, error: null };
  } catch (error) {
    const newProduct = {
      ...product,
      id: "local-" + Date.now(),
      created_at: new Date().toISOString(),
    };
    const local = getLocalProducts();
    local.push(newProduct);
    saveLocalProducts(local);
    clearProductCache();
    logAdminAction("product_created", { id: newProduct.id, name: product.name }, "success");
    return { data: newProduct, error: null };
  }
};

export const updateProduct = async (productId: string, updates: any) => {
  console.log("🔄 updateProduct called with:", { productId, updates });
  try {
    if (!isSupabaseConfigured || !supabase) {
      console.log("📱 Supabase not configured, updating in local storage");
      const local = getLocalProducts();
      const index = local.findIndex((p: any) => p.id === productId);
      
      if (index === -1) {
        console.error("❌ Product not found in local storage (ID: " + productId + ")");
        logAdminAction("product_updated", { id: productId, error: "not_found" }, "failure");
        return { data: null, error: "Product not found" };
      }

      console.log("✏️  Updating local product at index", index);
      local[index] = { ...local[index], ...updates };
      saveLocalProducts(local);
      clearProductCache();
      logAdminAction("product_updated", { id: productId, fields: Object.keys(updates) }, "success");
      console.log("✅ Updated local product");
      return { data: { id: productId, ...updates }, error: null };
    }

    console.log("☁️  Attempting Supabase update");
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId)
      .select();

    console.log("📡 Supabase response:", { hasError: !!error });

    if (error) {
      console.log("⚠️  Supabase error, falling back to local");
      const local = getLocalProducts();
      const index = local.findIndex((p: any) => p.id === productId);
      
      if (index > -1) {
        local[index] = { ...local[index], ...updates };
        saveLocalProducts(local);
        console.log("✅ Updated in local (Supabase was down)");
      } else {
        console.warn("⚠️  Product not in local storage either");
      }
      clearProductCache();
      logAdminAction("product_updated", { id: productId, fields: Object.keys(updates) }, "success");
      return { data: { id: productId, ...updates }, error: null };
    }

    console.log("✅ Supabase update successful");
    clearProductCache();
    logAdminAction("product_updated", { id: productId, fields: Object.keys(updates) }, "success");
    return { data, error: null };
  } catch (error) {
    console.error("❌ Exception in updateProduct:", error);
    const local = getLocalProducts();
    const index = local.findIndex((p: any) => p.id === productId);
    
    if (index > -1) {
      local[index] = { ...local[index], ...updates };
      saveLocalProducts(local);
    }
    clearProductCache();
    logAdminAction("product_updated", { id: productId, error: String(error) }, "failure");
    return { data: { id: productId, ...updates }, error: null };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const deletedIds = getDeletedIds();
    if (!deletedIds.includes(productId)) {
      deletedIds.push(productId);
      saveDeletedIds(deletedIds);
    }

    if (!isSupabaseConfigured || !supabase) {
      const local = getLocalProducts();
      const filtered = local.filter((p: any) => p.id !== productId);
      saveLocalProducts(filtered);
      clearProductCache();
      logAdminAction("product_deleted", { id: productId }, "success");
      return { data: { id: productId }, error: null };
    }

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      const local = getLocalProducts();
      const filtered = local.filter((p: any) => p.id !== productId);
      saveLocalProducts(filtered);
      clearProductCache();
      logAdminAction("product_deleted", { id: productId }, "success");
      return { data: { id: productId }, error: null };
    }

    const local = getLocalProducts();
    const filtered = local.filter((p: any) => p.id !== productId);
    saveLocalProducts(filtered);
    clearProductCache();
    logAdminAction("product_deleted", { id: productId }, "success");
    return { data, error: null };
  } catch (error) {
    const local = getLocalProducts();
    const filtered = local.filter((p: any) => p.id !== productId);
    saveLocalProducts(filtered);
    clearProductCache();
    logAdminAction("product_deleted", { id: productId, error: String(error) }, "failure");
    return { data: { id: productId }, error: null };
  }
};
