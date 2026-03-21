import { create } from "zustand";
import { getProducts } from "../utils/supabase";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  created_at?: string;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  version: number; // Increment on every products change to force subscribers to update
  fetchProducts: () => Promise<void>;
  invalidateCache: () => Promise<void>;
  removeProduct: (id: string) => void;
  updateProductInStore: (id: string, updates: Partial<Product>) => void;
  addProductToStore: (product: Product) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  version: 0,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await getProducts();
      // Prioritize data over error - if we have data, use it regardless of error
      if (data && Array.isArray(data) && data.length > 0) {
        set((state) => ({
          products: data as Product[],
          error: null,
          version: state.version + 1,
        }));
      } else if (data && Array.isArray(data)) {
        // Data exists but is empty array
        set((state) => ({
          products: data as Product[],
          error: null,
          version: state.version + 1,
        }));
      } else if (error) {
        // No data and there's an error
        set({ error: error as string, products: [] });
      } else {
        // No data and no error
        set({ products: [], error: null });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        products: [],
      });
    } finally {
      set({ loading: false });
    }
  },

  invalidateCache: async () => {
    // Trigger a refetch
    set({ loading: true });
    const { data, error } = await getProducts();
    // Prioritize data over error
    if (data && Array.isArray(data)) {
      set((state) => ({
        products: data as Product[],
        error: null,
        loading: false,
        version: state.version + 1,
      }));
    } else if (error) {
      set({ error: error as string, loading: false });
    } else {
      set({ products: [], loading: false });
    }
  },

  removeProduct: (id: string) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      version: state.version + 1,
    }));
  },

  updateProductInStore: (id: string, updates: Partial<Product>) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
      version: state.version + 1,
    }));
  },

  addProductToStore: (product: Product) => {
    set((state) => ({
      products: [product, ...state.products],
      version: state.version + 1,
    }));
  },
}));
