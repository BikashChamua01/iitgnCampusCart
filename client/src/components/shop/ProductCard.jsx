// src/components/shop/ProductCard.jsx
import React from "react";
import { FaRupeeSign, FaStar, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const {
    title,
    price,
    originalPrice,
    category,
    condition,
    images = [],
    rating = 0,
    numReviews = 0,
    available = true,
  } = product;

  const imageUrl = images[0]?.url || "/placeholder.png";
  const discount =
    originalPrice && price < originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <Link to={`/shop/products/${product._id}`}>
    <div className="relative bg-white shadow-lg rounded-xl overflow-hidden border border-[#e2d3f3] hover:shadow-2xl transition duration-300 group cursor-pointer ">
      {/* Discount Badge */}
      {discount && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          -{discount}%
        </span>
      )}

      {/* Sold Out Overlay */}
      {!available && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20">
          <span className="text-xl font-bold text-gray-500">Sold Out</span>
        </div>
      )}

      {/* Product Image with Hover Effect */}
      <div className="overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-[#6a0dad] truncate">
          {title}
        </h3>

        {/* Ratings */}
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? "" : "text-gray-300"} />
          ))}
          <span className="text-xs text-gray-500 ml-1">({numReviews})</span>
        </div>

        {/* Category & Condition */}
        <div className="text-sm text-gray-700 flex flex-wrap gap-2">
          <span className={`px-2 py-1 bg-[#f3e8ff] text-[#6a0dad] rounded-full text-xs font-medium
            
            `}>
            {category}
          </span>
          <span className={`px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium
             ${condition=="Poor" ?"text-red-600 bg-red-300":""}
            ${condition == "Fair" ? "text-yellow-700 bg-yellow-100" : ""}
            `}>
            {condition}
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 text-sm text-gray-800 flex items-center gap-2">
          <FaRupeeSign className="text-[#6a0dad]" />
          <span className="text-lg font-bold text-[#6a0dad]">{price}</span>
          {originalPrice && (
            <span className="line-through text-gray-400 ml-2 text-sm">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          {/* <Link to={`/shop/products/${product._id}`}> */}
            <button className="flex-1 text-sm font-semibold bg-[#6a0dad] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#6a0dad] hover:border hover:border-[#b27dd8] transition cursor-pointer">
              View Details
            </button>
          {/* </Link> */}
          <button
            disabled={!available}
            className={`flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md transition ${
              !available && "opacity-50 cursor-not-allowed"
            }`}
            title={available ? "Add to Cart" : "Not Available"}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;
