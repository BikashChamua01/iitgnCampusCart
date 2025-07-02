
// src/components/ProductCard.jsx
import React from "react";
import { FaRupeeSign, FaTag } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const {
    title,
    price,
    originalPrice,
    category,
    condition,
    images = [],
  } = product;

  const imageUrl = images[0]?.url || "/placeholder.png";

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-[#e2d3f3] hover:shadow-lg transition duration-300">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-[#6a0dad] truncate">
          {title}
        </h3>

        <div className="text-sm text-gray-700 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-[#f3e8ff] text-[#6a0dad] rounded-full text-xs font-medium">
            {category}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            {condition}
          </span>
        </div>

        <div className="mt-2 text-sm text-gray-800 flex items-center gap-2">
          <FaRupeeSign className="text-[#6a0dad]" />
          <span className="text-lg font-bold text-[#6a0dad]">{price}</span>
          {originalPrice && (
            <span className=" text-gray-500 ml-2 text-sm">
              Orginal Price : ₹{originalPrice}
            </span>
          )}
        </div>

        <button className="mt-3 text-sm font-semibold bg-[#6a0dad] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#6a0dad] hover:border hover:border-[#b27dd8] transition cursor-pointer">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

