import React from "react";
import { Link } from "react-router-dom";

export default function ShopFooter() {
  return (
    <footer
      className=" fixed bottom-0 left-0 w-full  text-text-light py-1 flex justify-around border-t border-purple-border lg:hidden"
      style={{
        backgroundColor: "#6a0dad", // Deep purple
        color: "#f4f4f4", // Light text
      }}
    >
      <Link to="/shop" className="flex flex-col items-center hover:text-white">
        🏠 <span className="text-xs">Home</span>
      </Link>
      <Link
        to="/shop/products"
        className="flex flex-col items-center hover:text-white"
      >
        📦 <span className="text-xs">Products</span>
      </Link>
      <Link
        to="/shop/listings"
        className="flex flex-col items-center hover:text-white"
      >
        📋 <span className="text-xs">Listings</span>
      </Link>
      <Link
        to="/shop/about"
        className="flex flex-col items-center hover:text-white"
      >
        🅰️<span className="text-xs">About</span>
      </Link>
    </footer>
  );
}
