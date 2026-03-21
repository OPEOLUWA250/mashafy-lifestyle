import React, { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import type { Product } from "../../types";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showAddedNotif, setShowAddedNotif] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) =>
    state.isWishlisted(product.id),
  );

  const handleAddToCart = () => {
    addItem(product, 1);
    setShowAddedNotif(true);
    setTimeout(() => setShowAddedNotif(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden group">
        <img
          src={
            product.image ||
            "https://via.placeholder.com/300x400?text=" + product.name
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
        >
          <Heart
            className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
            {product.category === "tees" ? "👕 Tees" : "📓 Journals"}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Colors/Sizes Preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-2 mb-4">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price and Button */}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">
            ₦{product.price.toLocaleString()}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`p-2 rounded-full transition ${
              product.inStock
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {showAddedNotif && (
          <div className="mt-3 p-2 bg-green-100 text-green-700 text-sm rounded text-center">
            ✓ Added to cart
          </div>
        )}
      </div>
    </div>
  );
};
