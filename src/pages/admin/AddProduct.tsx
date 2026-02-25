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
        price: formData.price,
        category: formData.category,
        image_url: formData.image_url,
        stock: formData.stock,
      });

      if (submitError) {
        const errorMessage =
          typeof submitError === "string"
            ? submitError
            : submitError?.message || "Failed to create product";
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
    <div className="min-h-screen bg-white">
      <Navbar isAdmin={true} />

      <div className="pt-20 md:pt-32 pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/admin/products")}
            className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-12 text-xs font-light"
          >
            <ArrowLeft className="w-3 h-3 mr-1.5" />
            Back
          </button>

          {/* Header */}
          <div className="mb-12 pb-6 border-b-4 border-primary-500">
            <h1 className="text-4xl font-light text-dark tracking-tight mb-2">
              Add New Product
            </h1>
            <div className="w-12 h-1 bg-primary-500 mb-6"></div>
            <p className="text-xs font-light text-gray-600 tracking-wide">
              Create a new product for your Tabitha Books store
            </p>
          </div>

          {/* Form */}
          <div className="border border-gray-200 p-8">
            {error && (
              <div className="mb-8 p-4 border border-gray-200">
                <p className="text-xs font-light text-dark">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-light text-dark mb-2 uppercase tracking-widest">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., I Dare to Stand Out"
                  className="w-full px-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-light text-dark mb-2 uppercase tracking-widest">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g., Unisex minimalist tee with universal appeal"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-light text-dark mb-2 uppercase tracking-widest">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:border-primary-500"
                >
                  <option value="tees">Tees</option>
                  <option value="journals">Journals</option>
                </select>
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-light text-dark mb-2 uppercase tracking-widest">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 8500"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-light text-dark mb-2 uppercase tracking-widest">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-200 text-xs font-light focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-light text-dark mb-2 uppercase tracking-widest">
                  Product Image *
                </label>
                <label className="flex items-center justify-center w-full px-4 py-8 border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
                  <div className="text-center">
                    <Upload className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-light text-gray-600">
                      Click to upload
                    </p>
                    <p className="text-xs font-light text-gray-500 mt-1">
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
                <div className="p-4 border border-gray-200">
                  <p className="text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                    Preview:
                  </p>
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-24 h-24 object-cover"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="flex-1 px-6 py-2 bg-primary-500 text-white font-light text-xs hover:bg-primary-600 transition uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-2 border border-gray-200 text-dark font-light text-xs hover:bg-gray-50 transition disabled:opacity-50 uppercase tracking-widest"
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
