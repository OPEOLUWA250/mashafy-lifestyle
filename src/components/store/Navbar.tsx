import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useWishlistStore } from "../../store/wishlistStore";

interface NavbarProps {
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.getTotal());

  return (
    <nav className="fixed w-full bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={isAdmin ? "/admin" : "/"}
            className="flex items-center space-x-2"
          >
            <img
              src="/mashafy-favicon.svg"
              alt="Mashafy"
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold text-primary-600">Mashafy</span>
          </Link>

          {/* Desktop Menu - Hidden for Admin */}
          {!isAdmin && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-primary-600 font-medium transition"
              >
                Contact
              </Link>
            </div>
          )}

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAdmin && (
              <>
                <Link to="/wishlist" className="relative">
                  <Heart className="w-6 h-6 text-gray-700 hover:text-primary-600 transition" />
                  {wishlistItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none pointer-events-none">
                      {wishlistItems}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative">
                  <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-primary-600 transition" />
                  {cartItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none pointer-events-none">
                      {cartItems}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Cart & Wishlist Icons & Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            {!isAdmin && (
              <>
                <Link to="/wishlist" className="relative p-1">
                  <Heart className="w-6 h-6 text-gray-700" />
                  {wishlistItems > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none pointer-events-none">
                      {wishlistItems}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative p-1">
                  <ShoppingBag className="w-6 h-6 text-gray-700" />
                  {cartItems > 0 && (
                    <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none pointer-events-none">
                      {cartItems}
                    </span>
                  )}
                </Link>
              </>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 bg-primary-600 text-white rounded-lg transition hover:bg-primary-700"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Hidden for Admin */}
        {isOpen && !isAdmin && (
          <div className="md:hidden pb-4 space-y-3 bg-beige-50 -mx-4 -mb-4 px-4 py-4 rounded-b-lg">
            <Link
              to="/"
              className="block text-gray-700 hover:text-primary-600 font-medium py-2"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block text-gray-700 hover:text-primary-600 font-medium py-2"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 hover:text-primary-600 font-medium py-2"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block text-gray-700 hover:text-primary-600 font-medium py-2"
            >
              Contact
            </Link>
            <Link
              to="/wishlist"
              className="block text-gray-700 hover:text-primary-600 font-medium py-2"
            >
              Wishlist ({wishlistItems})
            </Link>
            <Link
              to="/cart"
              className="block text-gray-700 hover:text-primary-600 font-medium py-2"
            >
              Cart ({cartItems})
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
