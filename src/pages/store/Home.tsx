import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";
import { ProductCard } from "../../components/store/ProductCard";
import type { Product } from "../../types";
import { ArrowRight, Zap, Shield, Heart } from "lucide-react";
import { getProducts } from "../../utils/supabase";

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await getProducts();
        if (error) {
          console.error("❌ Failed to fetch products:", error);
          return;
        }
        if (data && Array.isArray(data) && data.length > 0) {
          console.log(`✓ Loaded ${data.length} products successfully`);
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
            featured: true,
          }));
          setProducts(mapped);
        } else {
          console.warn("⚠️ No products returned from database");
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center bg-primary-50 px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-primary-600 mr-2" />
                <span className="text-sm font-semibold text-primary-600">
                  Welcome to Mashafy
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Live with <span className="text-primary-600">Intention,</span>{" "}
                Faith & Courage
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                Mashafy is a premium lifestyle brand for visionaries. Express
                your ambition through curated tees and journals designed for
                those who dare to stand out.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition group"
                >
                  Shop Now{" "}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:border-primary-600 hover:text-primary-600 transition"
                >
                  Learn More
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <span>Premium Quality Guaranteed</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Heart className="w-5 h-5 text-primary-600" />
                  <span>Join the Muse Community</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden md:block">
              <div className="relative h-96 md:h-full">
                <img
                  src="https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=600&fit=crop"
                  alt="Mashafy Collection"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white p-4 rounded-xl shadow-lg max-w-xs">
                  <p className="font-semibold text-lg">Premium Collection</p>
                  <p className="text-sm text-primary-100">
                    Crafted for the visionary in you
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our launch trio of premium tees and journals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading && products.length === 0
              ? [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                  />
                ))
              : products
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
            >
              View All Products <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mashafy stands for more than fashion. We believe in:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              "Ambition",
              "Faith",
              "Refinement",
              "Identity",
              "Confidence",
              "Audacity",
            ].map((value, idx) => (
              <div
                key={idx}
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-lg transition text-center"
              >
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  {value[0]}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA - Hidden for now */}
      {/*
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Join the Muse Community</h2>
          <p className="text-lg text-primary-100 mb-8">
            Be part of a gender-inclusive community of visionaries connected by
            purpose and belonging
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full md:w-96 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="mt-4 px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition">
            Subscribe Now
          </button>
        </div>
      </section>
      */}

      <Footer />
    </div>
  );
};
