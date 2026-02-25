import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t-2 border-primary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-light tracking-widest text-white mb-4">
              TABITHA BOOKS
            </h3>
            <p className="text-xs font-light text-gray-400 mb-6 leading-relaxed">
              Curated books that inspire, transform, and empower readers on
              their journey.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="#"
                className="w-4 h-4 text-gray-500 hover:text-primary-500 transition"
              >
                <Facebook className="w-full h-full" />
              </a>
              <a
                href="#"
                className="w-4 h-4 text-gray-500 hover:text-primary-500 transition"
              >
                <Instagram className="w-full h-full" />
              </a>
              <a
                href="#"
                className="w-4 h-4 text-gray-500 hover:text-primary-500 transition"
              >
                <Twitter className="w-full h-full" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="text-center md:text-left">
            <h4 className="text-xs font-light tracking-widest text-white mb-4 uppercase">
              Shop
            </h4>
            <ul className="space-y-2 text-xs font-light text-gray-400">
              <li>
                <Link
                  to="/shop?category=tees"
                  className="hover:text-primary-500 transition"
                >
                  Tees
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=journals"
                  className="hover:text-primary-500 transition"
                >
                  Journals
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?featured=true"
                  className="hover:text-primary-500 transition"
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-primary-500 transition">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="text-center md:text-left">
            <h4 className="text-xs font-light tracking-widest text-white mb-4 uppercase">
              Company
            </h4>
            <ul className="space-y-2 text-xs font-light text-gray-400">
              <li>
                <Link to="/about" className="hover:text-primary-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-500 transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-500 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary-500 transition"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-xs font-light tracking-widest text-white mb-4 uppercase">
              Contact
            </h4>
            <ul className="space-y-3 text-xs font-light">
              <li className="flex md:flex-row justify-center md:justify-start items-center space-x-2 text-gray-400 hover:text-primary-500 transition">
                <Phone className="w-3 h-3" />
                <a href="tel:+2348180129670">+234 818 012 9670</a>
              </li>
              <li className="flex md:flex-row justify-center md:justify-start items-center space-x-2 text-gray-400 hover:text-primary-500 transition">
                <Mail className="w-3 h-3" />
                <a href="mailto:hello@tabithabooks.com">
                  hello@tabithabooks.com
                </a>
              </li>
              <li className="flex md:flex-row justify-center md:justify-start items-start space-x-2 text-gray-400">
                <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-center md:text-left text-xs font-light text-gray-500">
            <p>&copy; 2026 Tabitha Books. All rights reserved.</p>
            <p>
              Made with 💖 by{" "}
              <a
                href="https://portfolio-website-tau-one-87.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-500 transition"
              >
                devopeoluwa
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
