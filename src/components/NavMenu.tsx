
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-0 sm:px-2 lg:px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center pl-2">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
              <Package className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Gold Coast</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link
              to="/shipping-calculator"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Shipping Calculator
            </Link>
            <Link
              to="/frequently-shipped-items"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Frequently Shipped Items
            </Link>
            <Link
              to="/request-call"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Request a Call
            </Link>
            <Link
              to="/request-quote"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              Request a Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link
              to="/shipping-calculator"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={closeMenu}
            >
              Shipping Calculator
            </Link>
            <Link
              to="/frequently-shipped-items"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={closeMenu}
            >
              Frequently Shipped Items
            </Link>
            <Link
              to="/request-call"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={closeMenu}
            >
              Request a Call
            </Link>
            <Link
              to="/request-quote"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={closeMenu}
            >
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavMenu;
