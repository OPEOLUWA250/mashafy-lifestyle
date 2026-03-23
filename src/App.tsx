import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";

// Store Pages
import { Home } from "./pages/store/Home";
import { Shop } from "./pages/store/Shop";
import { Cart } from "./pages/store/Cart";
import { Wishlist } from "./pages/store/Wishlist";
import { About } from "./pages/store/About";
import { Contact } from "./pages/store/Contact";

// Admin Pages
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminProducts } from "./pages/admin/Products";
import { AddProduct } from "./pages/admin/AddProduct";
import { EditProduct } from "./pages/admin/EditProduct";
import { AdminLogin } from "./pages/admin/Login";

// Components
import { FloatingButtons } from "./components/FloatingButtons";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { getProducts, checkSupabaseConfig } from "./utils/supabase";
import { useAutoRefresh } from "./hooks/useAutoRefresh";

function App() {
  // Enable automatic product cache refresh on visibility/focus changes
  useAutoRefresh();

  useEffect(() => {
    // Diagnostic: Check Supabase configuration on startup
    checkSupabaseConfig();
    
    // Preload products on app startup with FORCE REFRESH
    const preloadProducts = async () => {
      try {
        console.log("🚀 App startup: Force refreshing products from Supabase");
        await getProducts(true); // Force fresh fetch
      } catch (err) {
        console.error("Failed to preload products:", err);
      }
    };

    preloadProducts();
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <FloatingButtons />
      <Routes>
        {/* Store Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/new"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/:id/edit"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
