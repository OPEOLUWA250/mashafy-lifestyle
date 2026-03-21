import { useEffect, useCallback } from "react";
import { clearProductCache } from "../utils/supabase";

/**
 * Hook that listens for product changes across pages
 * Triggers a re-fetch when admin makes create/update/delete operations
 */
export const useProductsSync = (onSync: () => void) => {
  const handleSync = useCallback(() => {
    console.log("📢 Product sync event received");
    clearProductCache();
    onSync();
  }, [onSync]);

  useEffect(() => {
    // Listen for product changes from other tabs/pages
    window.addEventListener("mashafy-products-changed", handleSync);

    return () => {
      window.removeEventListener("mashafy-products-changed", handleSync);
    };
  }, [handleSync]);
};
