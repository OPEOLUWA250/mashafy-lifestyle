import { useEffect } from "react";
import { clearProductCache } from "../utils/supabase";

/**
 * Hook that automatically refreshes product cache when:
 * 1. Page gains visibility (user switches back to tab)
 * 2. Network comes online
 * 3. Window regains focus
 * 4. Periodic background refresh (every 2 minutes to ensure freshness)
 */
export const useAutoRefresh = () => {
  useEffect(() => {
    // Handle page visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("🔄 Page became visible - auto-refreshing product cache");
        clearProductCache();
      }
    };

    // Handle network status change
    const handleOnline = () => {
      console.log("📡 Network came online - auto-refreshing product cache");
      clearProductCache();
    };

    // Handle window focus
    const handleFocus = () => {
      console.log("🪟 Window regained focus - auto-refreshing product cache");
      clearProductCache();
    };

    // Periodic background refresh every 2 minutes (even if user stays on page)
    const periodicRefreshInterval = setInterval(() => {
      if (!document.hidden) {
        console.log("⏰ Periodic refresh (2 min interval) - clearing product cache");
        clearProductCache();
      }
    }, 2 * 60 * 1000); // 2 minutes

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("focus", handleFocus);
      clearInterval(periodicRefreshInterval);
    };
  }, []);
};

