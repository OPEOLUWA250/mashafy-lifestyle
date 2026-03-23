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
const CACHE_DURATION = 5 * 60 * 1000; // Reduced from 1 hour to 5 minutes for better sync

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

// ⚠️ IMPORTANT: Local products are ONLY for offline/fallback scenarios
// These should be TEMPORARY and synced to Supabase as soon as possible
// Do NOT use as primary storage!
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
    console.log("⚠️  Saved to LOCAL STORAGE (should be synced to Supabase):", unique.length, "products");
  } catch (e) {
    console.warn("Failed to save local products");
  }
};

// Get products - SUPABASE IS SOURCE OF TRUTH
export const getProducts = async (forceRefresh = false) => {
  try {
    const localPendingProducts = getLocalProducts();
    // ONLY use deletedIds for local pending products, NOT for Supabase products
    const deletedLocalIds = getDeletedIds().filter(id => id.startsWith("local-pending-"));
    
    console.log("🔍 getProducts called:", { forceRefresh });
    console.log("  💾 Local pending products from storage:", localPendingProducts.length, "items");
    console.log("  📦 Deleted LOCAL product IDs:", deletedLocalIds);

    // If Supabase is NOT configured, return ONLY local products (true offline mode)
    if (!isSupabaseConfigured || !supabase) {
      console.log("  ⚠️  OFFLINE MODE: Supabase not configured, returning ONLY local products");
      const filtered = localPendingProducts.filter(p => !deletedLocalIds.includes(p.id));
      console.log("  ✅ Offline: returning", filtered.length, "products");
      return { data: filtered, error: null };
    }

    // Use cache ONLY if valid AND not forced to refresh AND cache has products
    if (!forceRefresh && cachedProducts !== null && cachedProducts.length > 0 && Date.now() < cacheTtl) {
      console.log("  ✅ Using VALID CACHE:", cachedProducts.length, "products from Supabase");
      // NEVER filter Supabase products by deletion tracking
      const combined = [...cachedProducts, ...localPendingProducts.filter(p => !deletedLocalIds.includes(p.id))];
      console.log("  ✅ Returning", combined.length, "total products (Supabase + pending)");
      return { data: combined, error: null };
    }

    // Force refresh? Clear cache first
    if (forceRefresh) {
      console.log("  🔄 FORCE REFRESH: Clearing cache...");
      cachedProducts = null;
      cacheTtl = 0;
    }

    // Fetch from Supabase (ALWAYS if cache expired or forced)
    console.log("  🌐 FETCHING from Supabase...");
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, category, stock, image_url, created_at")
      .order("created_at", { ascending: false });

    console.log("  📡 Supabase response:", error ? "❌ ERROR" : "✅ OK", "fetched", data?.length || 0, "products");

    // If Supabase returns an error
    if (error) {
      console.error("  ❌ Supabase fetch error:", error.message);
      console.log("  ⚠️  FALLBACK: Using cached data + local pending products");
      // Still return Supabase products if available, even if errored
      const fallbackData = cachedProducts || [];
      const combined = [...fallbackData, ...localPendingProducts.filter(p => !deletedLocalIds.includes(p.id))];
      console.log("  ✅ Fallback: returning", combined.length, "products");
      return { data: combined, error: null };
    }

    // Supabase returned empty
    if (!data || data.length === 0) {
      console.log("  ℹ️  Supabase returned no products");
      const filtered = localPendingProducts.filter(p => !deletedLocalIds.includes(p.id));
      console.log("  ✅ Returning", filtered.length, "products (local pending)");
      return { data: filtered, error: null };
    }

    // Success! Update cache and return
    console.log("  ✅ Supabase fetch successful!");
    cachedProducts = data;
    cacheTtl = Date.now() + CACHE_DURATION;
    saveCacheToStorage(data);

    // NEVER filter Supabase products - they are source of truth
    const combined = [...data, ...localPendingProducts.filter(p => !deletedLocalIds.includes(p.id))];
    console.log("  ✅ Returning", combined.length, "total products (Supabase + pending)");
    return { data: combined, error: null };
  } catch (error) {
    console.error("  ❌ Unexpected error in getProducts:", error);
    const localPendingProducts = getLocalProducts();
    const deletedLocalIds = getDeletedIds().filter(id => id.startsWith("local-pending-"));
    const filtered = localPendingProducts.filter(p => !deletedLocalIds.includes(p.id));
    console.log("  ✅ Emergency fallback: returning", filtered.length, "products (local only)");
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

// ⚠️ CRITICAL: Reset all product data - use when sync is broken
export const hardResetProductData = async () => {
  console.warn("⚠️⚠️⚠️ HARD RESET: Clearing ALL product cache to force fresh Supabase fetch");
  cachedProducts = null;
  cacheTtl = 0;
  try {
    localStorage.removeItem("mashafy_products_cache");
  } catch (e) {
    console.warn("Failed to perform hard reset");
  }
  triggerSync();
  // Force a fresh fetch from Supabase
  return getProducts(true);
};

export const createProduct = async (product: any) => {
  console.log("📝 createProduct called with:", { name: product.name, category: product.category });
  
  try {
    // If Supabase not configured, must store locally
    if (!isSupabaseConfigured || !supabase) {
      console.warn("⚠️  Supabase NOT configured - FORCED to use LOCAL storage");
      const newProduct = {
        ...product,
        id: "local-pending-" + Date.now(),
        created_at: new Date().toISOString(),
        _synced: false, // Mark as NOT synced
      };
      const local = getLocalProducts();
      local.push(newProduct);
      saveLocalProducts(local);
      clearProductCache();
      logAdminAction("product_created", { id: newProduct.id, name: product.name, synced: false }, "success");
      console.warn("⚠️  Product saved LOCALLY ONLY - will need sync when Supabase is available");
      return { data: newProduct, error: null };
    }

    // Try Supabase first
    console.log("☁️  Attempting to save to Supabase...");
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select();

    if (error) {
      console.error("❌ Supabase INSERT error:", error.message);
      console.warn("⚠️  FALLBACK: Saving to local storage - product will sync when Supabase is available");
      
      // Save locally with pending flag
      const newProduct = {
        ...product,
        id: "local-pending-" + Date.now(),
        created_at: new Date().toISOString(),
        _synced: false,
      };
      const local = getLocalProducts();
      local.push(newProduct);
      saveLocalProducts(local);
      clearProductCache();
      logAdminAction("product_created", { id: newProduct.id, name: product.name, synced: false, supabaseError: error.message }, "success");
      return { data: newProduct, error: null };
    }

    // Success on Supabase!
    console.log("✅ Product saved to Supabase successfully!");
    clearProductCache();
    logAdminAction("product_created", { id: data?.[0]?.id, name: product.name, synced: true }, "success");
    console.log("✅ Product ID:", data?.[0]?.id);
    return { data, error: null };
  } catch (error) {
    console.error("❌ Exception in createProduct:", error);
    console.warn("⚠️  FALLBACK: Saving to local storage");
    
    // Save locally with pending flag
    const newProduct = {
      ...product,
      id: "local-pending-" + Date.now(),
      created_at: new Date().toISOString(),
      _synced: false,
    };
    const local = getLocalProducts();
    local.push(newProduct);
    saveLocalProducts(local);
    clearProductCache();
    logAdminAction("product_created", { id: newProduct.id, name: product.name, synced: false, error: String(error) }, "success");
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
