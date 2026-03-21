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
        const { data } = await getProducts();
        if (data && Array.isArray(data)) {
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
    <div className="min-h-screen bg-white">
      <Navbar isAdmin={true} />

      <div className="pt-20 md:pt-32 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 pb-6 border-b-4 border-primary-500">
            <div>
              <h1 className="text-4xl font-light text-dark tracking-tight">
                Products
              </h1>
              <div className="w-12 h-1 bg-primary-500 mt-3"></div>
            </div>
            <Link
              to="/admin/products/new"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 bg-primary-500 text-white font-light text-xs hover:bg-primary-600 transition uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-light text-dark uppercase tracking-widest">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-light text-dark uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-light text-dark uppercase tracking-widest">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-light text-dark uppercase tracking-widest">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-light text-dark uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-xs font-light text-gray-600"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-xs font-light text-gray-600"
                    >
                      {products.length === 0
                        ? "No products yet. Click 'Add Product' to create one."
                        : "No products match your search."}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 object-cover"
                          />
                          <span className="font-light text-xs text-dark">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-light text-gray-600 capitalize">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-xs font-light text-primary-500">
                        ₦{Number(product.price).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span
                          className={`px-2 py-1 text-xs font-light border ${
                            product.stock > 20
                              ? "border-green-200 text-green-700"
                              : product.stock > 10
                                ? "border-yellow-200 text-yellow-700"
                                : "border-orange-200 text-orange-700"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs space-x-2">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="p-1 text-gray-400 hover:text-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={deleting !== null}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1 text-gray-400 hover:text-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={deleting !== null}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="text-center py-8 text-xs font-light text-gray-600">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="border border-gray-200 p-6 text-center text-xs font-light text-gray-600">
                {products.length === 0
                  ? "No products yet. Click 'Add Product' to create one."
                  : "No products match your search."}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 hover:border-primary-500 transition p-4"
                >
                  <div className="flex gap-3 mb-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-light text-xs text-dark line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs font-light text-gray-600 capitalize mt-1">
                        {product.category}
                      </p>
                      <p className="text-xs font-light text-primary-500 mt-2">
                        ₦{Number(product.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 text-xs font-light border ${
                        product.stock > 20
                          ? "border-green-200 text-green-700"
                          : product.stock > 10
                            ? "border-yellow-200 text-yellow-700"
                            : "border-orange-200 text-orange-700"
                      }`}
                    >
                      {product.stock} units
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="p-1 text-gray-400 hover:text-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={deleting !== null}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 text-gray-400 hover:text-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={deleting !== null}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
