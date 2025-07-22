import React from "react";
import { FaRupeeSign, FaStar, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCard = ({
  product,
  isWishlisted,
  addToWishlist,
  deleteFromWishlist,
}) => {
  const {
    _id,
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

  const getConditionStyles = (condition) => {
    switch (condition) {
      case "New":
        return "bg-blue-100 text-blue-700";
      case "Like New":
        return "bg-indigo-100 text-indigo-700";
      case "Good":
        return "bg-green-100 text-green-700";
      case "Fair":
        return "bg-yellow-100 text-yellow-700";
      case "Poor":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isWishlisted) {
      deleteFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return (
    <div className="group block bg-white rounded-xl border p-1 border-[#e2d3f3] overflow-hidden shadow-sm hover:shadow-md transition duration-300 w-full max-w-xs mx-auto">
      <Link to={`/shop/products/${_id}`}>
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
          />
          {/* wishlist button */}
          <button
            onClick={handleWishlist}
            className="group absolute top-3 right-4 outline-none cursor-pointer z-10 bg-transparent border-none w-fit"
            aria-label="Toggle wishlist"
          >
            <FaHeart
              className={`
            heart-icon w-6 h-6 transition-all duration-300
            ${
              isWishlisted
                ? "text-red-600 fancy-pop"
                : "text-white not-wishlisted hover:text-red-400 heart-outline"
            }
          `}
            />
          </button>

          {/* discount and available tag */}
          {discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow z-10">
              -{discount}%
            </span>
          )}
          {!available && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20">
              <span className="text-base font-bold text-gray-500">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-2 flex flex-col gap-1">
          <h3 className="text-base font-semibold text-gray-800 truncate">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            {[...Array(5)].map((_, idx) => (
              <FaStar
                key={idx}
                className={idx < rating ? "" : "text-gray-300"}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({numReviews})</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full">
              {category}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full ${getConditionStyles(
                condition
              )}`}
            >
              {condition}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <span className="text-lg font-bold text-[#6a0dad] flex items-center">
              <FaRupeeSign className="text-sm mr-1" />
              {price}
            </span>
            {originalPrice && (
              <span className="line-through text-gray-400 text-sm">
                ₹{originalPrice}
              </span>
            )}
          </div>
          <div className="flex gap-1 mt-2">
            <button className="custom-button">View Details</button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
