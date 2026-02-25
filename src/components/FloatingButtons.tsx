import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export const FloatingButtons: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdminPage = location.pathname.startsWith("/admin");

  // Don't show floating buttons on admin pages
  if (isAdminPage) {
    return null;
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/2348180018752", "_blank");
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="flex items-center justify-center w-10 h-10 text-white hover:opacity-80 transition"
          aria-label="Back to top"
          style={{ backgroundColor: "#FF5B00" }}
        >
          <FontAwesomeIcon
            icon={faArrowUp}
            style={{ color: "white", fontSize: "16px" }}
          />
        </button>
      )}

      {/* WhatsApp Button */}
      {showBackToTop && (
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-center w-10 h-10 bg-green-500 text-white hover:bg-green-600 transition"
          aria-label="Contact via WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </button>
      )}
    </div>
  );
};
