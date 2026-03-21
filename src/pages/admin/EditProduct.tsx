import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../../components/store/Navbar";
import {
  getProducts,
  updateProduct,
  clearProductCache,
} from "../../utils/supabase";
import { ArrowLeft, Upload } from "lucide-react";

export const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "tees",
    image_url: "",
    stock: 0,
  });

  // Fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID not found");
        setFetching(false);
        return;
      }

      try {
        const { data } = await getProducts();
        console.log("📦 Fetched products:", data);
        console.log("🔍 Looking for product ID:", id);
        if (data && Array.isArray(data)) {
          const product = data.find((p: any) => p.id === id);
          console.log("✅ Found product:", product);
          if (product) {
            setFormData({
              name: product.name,
              description: product.description || "",
              price: product.price,
              category: product.category,
              image_url: product.image_url,
              stock: product.stock,
            });
          } else {
            console.error("❌ Product not found in fetched data");
            setError("Product not found");
          }
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          image_url: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Form submission started");
    console.log("📋 Product ID:", id);
    console.log("📋 Form data:", formData);

    if (
      !formData.name ||
      !formData.price ||
      !formData.image_url ||
      !formData.description
    ) {
      const missingFields = [];
      if (!formData.name) missingFields.push("name");
      if (!formData.price) missingFields.push("price");
      if (!formData.image_url) missingFields.push("image_url");
      if (!formData.description) missingFields.push("description");
      console.error("❌ Missing required fields:", missingFields);
      setError("Please fill in all required fields");
      return;
    }

    if (formData.stock < 0) {
      setError("Stock cannot be negative");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🔄 Calling updateProduct with:", { id, updates: formData });
      const { error: submitError } = await updateProduct(id || "", {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        image_url: formData.image_url,
        stock: formData.stock,
      });

      console.log("📡 Update response error:", submitError);

      if (submitError) {
        const errorMessage =
          typeof submitError === "string"
            ? submitError
            : String(submitError);
        console.error("❌ Update error:", submitError);
        setError(errorMessage);
        return;
      }

      console.log("✅ Update successful, redirecting to products");
      // Success - clear cache and navigate back to products
      clearProductCache();
      navigate("/admin/products");
    } catch (err: any) {
      console.error("❌ Try-catch error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isAdmin={true} />
        <div className="pt-20 md:pt-32 pb-20 px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center">
          <p className="text-gray-600 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} />

      <div className="pt-20 md:pt-32 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/admin/products")}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </button>

          {/* Form Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">
              Edit Product
            </h1>

            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., I Dare to Stand Out"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g., Unisex minimalist tee with universal appeal"
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                  required
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Price (₦) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="8500"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                    required
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                    Stock <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="50"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                >
                  <option value="tees">Tees</option>
                  <option value="journals">Journals</option>
                </select>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-4">
                  Product Image <span className="text-red-600">*</span>
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-600 hover:bg-primary-50 transition">
                  <div className="flex flex-col items-center justify-center pt-3 sm:pt-5 pb-3 sm:pb-6">
                    <Upload className="w-6 sm:w-8 h-6 sm:h-8 text-gray-400 mb-1 sm:mb-2" />
                    <p className="text-xs sm:text-sm text-gray-900 font-medium text-center px-2">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-600 text-center px-2">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Image Preview */}
                {formData.image_url && (
                  <div className="mt-3 sm:mt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Preview
                    </p>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-24 h-24 sm:w-40 sm:h-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="flex-1 px-3 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-3 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
