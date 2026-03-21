import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/store/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { getProducts, deleteProduct } from "../../utils/supabase";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

export const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("📖 Products Page: Loading with FORCE REFRESH");
        const { data } = await getProducts(true); // Force refresh!
        if (data && Array.isArray(data)) {
          console.log("✅ Loaded", data.length, "products");
          setProducts(data as Product[]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (productId: string) => {
    navigate(`/admin/products/${productId}/edit`);
  };

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
          alert("Failed to delete product");
          console.error("Delete error:", error);
        } else {
          // Remove product from local state
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar isAdmin={true} />

      <div className="pt-20 md:pt-32 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                Products
              </h1>
              <p className="text-gray-600 text-sm">Manage all your store products</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                to="/admin/products/new"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md text-sm hover:scale-105 transform"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm transition-all bg-white shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <p className="text-gray-600 text-sm">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {products.length === 0
                  ? "No products yet."
                  : "No products match your search."}
              </p>
              {!searchTerm && products.length === 0 && (
                <Link
                  to="/admin/products/new"
                  className="inline-flex items-center px-6 py-2.5 mt-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first product
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">
                                {product.name}
                              </p>
                              {product.description && (
                                <p className="text-xs text-gray-500 truncate mt-1">
                                  {product.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize font-medium">
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="font-bold text-primary-600 text-base">
                            ₦{Number(product.price).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                              product.stock > 20
                                ? "bg-green-100 text-green-700"
                                : product.stock > 10
                                  ? "bg-yellow-100 text-yellow-700"
                                  : product.stock > 0
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.stock > 0 ? `${product.stock} units` : "Out of stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleEdit(product.id)}
                              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={deleting !== null}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={deleting !== null}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex gap-4 mb-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 shadow-sm border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                            {product.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-600 capitalize mb-2">
                          <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold inline-block">
                            {product.category}
                          </span>
                        </p>
                        <p className="text-sm font-bold text-primary-600">
                          ₦{Number(product.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          product.stock > 20
                            ? "bg-green-100 text-green-700"
                            : product.stock > 10
                              ? "bg-yellow-100 text-yellow-700"
                              : product.stock > 0
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock}` : "Out"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={deleting !== null}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          )}
        </div>
      </div>
    </div>
  );
};
