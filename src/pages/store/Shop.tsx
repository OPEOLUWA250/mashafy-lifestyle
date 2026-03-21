import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";
import { ProductCard } from "../../components/store/ProductCard";
import type { Product } from "../../types";
import { Filter, X } from "lucide-react";
import { getProducts } from "../../utils/supabase";
import { useProductsSync } from "../../hooks/useProductsSync";

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">(
    "newest",
  );
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts();
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.name,
          price: p.price,
          category: p.category,
          image: p.image_url,
          sizes: ["XS", "S", "M", "L", "XL", "XXL"],
          colors: ["#000000", "#FFFFFF"],
          inStock: (p.stock || 0) > 0,
          featured: false,
        }));
        setProducts(mapped);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Listen for product changes from admin
  useProductsSync(fetchProducts);

  const filteredAndSortedProducts = useMemo(() => {
    let items = [...products];

    // Filter by category
    if (selectedCategory) {
      items = items.filter((p) => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;
      default:
        // Keep original order (newest)
        break;
    }

    return items;
  }, [selectedCategory, sortBy, products]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Our Collection
          </h1>
          <p className="text-lg text-gray-600">
            Premium tees and journals designed for the visionary in you
          </p>
        </div>
      </section>

      {/* Shop Content */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block lg:col-span-1 bg-gray-50 p-6 rounded-lg h-fit`}
            >
              <div className="flex justify-between items-center lg:block mb-6 lg:mb-0">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-600 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase">
                  Category
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="w-4 h-4 text-primary-600 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700 group-hover:text-primary-600">
                      All Items
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value="tees"
                      checked={selectedCategory === "tees"}
                      onChange={() => setSelectedCategory("tees")}
                      className="w-4 h-4 text-primary-600 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700 group-hover:text-primary-600">
                      👕 Tees
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value="journals"
                      checked={selectedCategory === "journals"}
                      onChange={() => setSelectedCategory("journals")}
                      className="w-4 h-4 text-primary-600 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700 group-hover:text-primary-600">
                      📓 Journals
                    </span>
                  </label>
                </div>
              </div>

              {/* Sort Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase">
                  Sort By
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "newest" | "price-low" | "price-high",
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Clear Filters */}
              {selectedCategory && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSortBy("newest");
                  }}
                  className="w-full px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden mb-6 flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition w-full justify-center"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing{" "}
                  <span className="font-bold">
                    {filteredAndSortedProducts.length}
                  </span>{" "}
                  products
                </p>
              </div>

              {loading && products.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No products found in this category.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
