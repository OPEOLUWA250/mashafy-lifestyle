import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/store/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Search, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";
import {
  getProducts,
  deleteProduct,
  clearProductCache,
} from "../../utils/supabase";

interface ProductData {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
}

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // Enable session timeout tracking
  useSessionTimeout();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null);
        const { data: productsData, error: fetchError } = await getProducts();

        if (fetchError) {
          console.error("Fetch error:", fetchError);
          setError(
            typeof fetchError === "string"
              ? fetchError
              : "Failed to load products",
          );
          setProducts([]);
          return;
        }

        if (productsData && Array.isArray(productsData)) {
          setProducts(productsData as ProductData[]);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load dashboard",
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDelete = async (productId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      setDeleting(productId);
      try {
        const { error } = await deleteProduct(productId);
        if (error) {
          const errorMessage =
            typeof error === "string"
              ? error
              : String(error);
          alert(errorMessage);
          console.error("Delete error:", error);
        } else {
          clearProductCache();
          setProducts((prev) => prev.filter((p) => p.id !== productId));
        }
      } catch (err) {
        alert("An error occurred while deleting");
        console.error("Delete error:", err);
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin={true} />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin={true} />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <p className="text-red-800 font-semibold">
              Error loading dashboard
            </p>
            <p className="text-red-700 text-sm mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} />

      <div className="pt-20 md:pt-32 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Dashboard
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/admin/products/new"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-lg text-sm sm:text-base"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Link>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-lg text-sm sm:text-base"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Products
            </h2>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm sm:text-base"
                />
              </div>
            </div>

            {products.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <span className="font-medium text-gray-900">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            ₦{Number(product.price).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                product.stock > 20
                                  ? "bg-green-100 text-green-800"
                                  : product.stock > 10
                                    ? "bg-yellow-100 text-yellow-800"
                                    : product.stock > 0
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {product.stock > 0 ? `${product.stock}` : "Out"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            <Link
                              to={`/admin/products/${product.id}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition inline-flex disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex"
                              disabled={deleting !== null}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                    >
                      <div className="flex gap-3 mb-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-600 capitalize">
                            {product.category}
                          </p>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            ₦{Number(product.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.stock > 20
                              ? "bg-green-100 text-green-800"
                              : product.stock > 10
                                ? "bg-yellow-100 text-yellow-800"
                                : product.stock > 0
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock}` : "Out"}
                        </span>
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition inline-flex"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex"
                            disabled={deleting !== null}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  {searchTerm
                    ? "No products match your search."
                    : "No products yet."}{" "}
                  {!searchTerm && (
                    <Link
                      to="/admin/products/new"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Create one now
                    </Link>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
