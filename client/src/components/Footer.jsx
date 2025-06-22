// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-3 flex justify-around md:hidden">
      <Link to="/" className="flex flex-col items-center">
        🏠 <span className="text-xs">Home</span>
      </Link>
      <Link to="/products" className="flex flex-col items-center">
        📦 <span className="text-xs">Products</span>
      </Link>
      <Link to="/listings" className="flex flex-col items-center">
        📋 <span className="text-xs">Listings</span>
      </Link>
      <Link to="/about" className="flex flex-col items-center">
        ℹ️ <span className="text-xs">About</span>
      </Link>
    </footer>
  );
}
