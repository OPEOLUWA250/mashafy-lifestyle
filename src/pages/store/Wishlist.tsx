import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/store/Navbar";
import { Footer } from "../../components/store/Footer";
import { useWishlistStore } from "../../store/wishlistStore";
import { Trash2, ArrowLeft, Heart } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

export const Wishlist: React.FC = () => {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (item: any) => {
    addToCart(item, 1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-beige-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <h1 className="text-5xl font-bold text-gray-900">My Wishlist</h1>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start adding items to your wishlist to save them for later
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-8">
                You have {items.length} item{items.length !== 1 ? "s" : ""} in
                your wishlist
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {item.featured && (
                        <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                        {item.category === "tees" ? "👕 Tees" : "📓 Journals"}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 my-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900 my-4">
                        ₦{item.price.toLocaleString()}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                          className={`flex-1 py-2 rounded-lg font-semibold transition ${
                            item.inStock
                              ? "bg-primary-600 text-white hover:bg-primary-700"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {item.inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-600 bg-transparent border border-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};
