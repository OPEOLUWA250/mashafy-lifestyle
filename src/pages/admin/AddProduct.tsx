import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/store/Navbar";
import { createProduct, clearProductCache } from "../../utils/supabase";
import { ArrowLeft, Upload } from "lucide-react";

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "tees",
    image_url: "",
    stock: 0,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.image_url ||
      !formData.description
    ) {
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
      const { error: submitError } = await createProduct({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        image_url: formData.image_url,
        stock: formData.stock,
      });

      if (submitError) {
        const errorMessage =
          typeof submitError === "string"
            ? submitError
            : String(submitError);
        console.error("Create error:", submitError);
        setError(errorMessage);
        return;
      }

      // Success - clear cache and navigate back
      clearProductCache();
      navigate("/admin/products");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} />

      <div className="pt-20 md:pt-32 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/admin/products")}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 md:mt-2">
              Create a new product for your Mashafy store
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8">
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                  Product Name *
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
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                  Description *
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

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                  Category *
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

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 8500"
                    min="0"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    min="0"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                  Product Image *
                </label>
                <label className="flex items-center justify-center w-full px-3 sm:px-4 py-4 sm:py-6 border-2 border-dashed border-primary-300 rounded-lg cursor-pointer hover:bg-primary-50 transition">
                  <div className="text-center">
                    <Upload className="w-6 sm:w-8 h-6 sm:h-8 text-primary-600 mx-auto mb-1 sm:mb-2" />
                    <p className="text-xs sm:text-sm font-medium text-primary-600">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
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
              </div>

              {/* Preview */}
              {formData.image_url && (
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    Preview:
                  </p>
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="flex-1 px-3 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-3 sm:px-6 py-2.5 sm:py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
