import React from "react";
import { Link } from "react-router-dom";

export default function AdminFooter() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-purple text-text-light py-3 flex justify-around border-t border-purple-border md:hidden bg-purple-800">
      <Link to="/" className="flex flex-col items-center hover:text-white">
        🏠 <span className="text-xs mt-1">Home</span>
      </Link>
      <Link
        to="/products"
        className="flex flex-col items-center hover:text-white"
      >
        📦 <span className="text-xs mt-1">Products</span>
      </Link>
      <Link
        to="/listings"
        className="flex flex-col items-center hover:text-white"
      >
        📋 <span className="text-xs mt-1">Listings</span>
      </Link>
      <Link to="/about" className="flex flex-col items-center hover:text-white">
        <span className="text-xs mt-1">About</span>
      </Link>
    </footer>
  );
}
