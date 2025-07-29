<<<<<<< Updated upstream
import { FaRupeeSign, FaStar, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToWishlist, deleteFromWishlist } from "@/store/wishlist-slice";
import BuyRequestDialogBox from "./BuyRequestDialogBox";

const ProductCard = ({ product, isWishlisted }) => {
=======
/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FaRupeeSign, FaStar, FaShoppingCart } from "react-icons/fa";

const appearVariants = {
  hidden: { scale: 0.96, y: 24 },
  visible: {
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 14 },
  },
};

const ProductCard = ({ product }) => {
>>>>>>> Stashed changes
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
  const dispatch = useDispatch();

  const imageUrl = images[0]?.url || "/placeholder.png";
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  const discount =
    originalPrice && price < originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;
<<<<<<< Updated upstream

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
      dispatch(deleteFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };

  return (
    <div className="group block bg-white rounded-xl  p-1  overflow-hidden  w-full max-w-xs mx-auto transition-shadow duration-300 shadow hover:shadow-[0_4px_20px_0_rgba(138,43,226,0.4)]">
      <Link to={`/shop/products/${_id}`}>
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-101 rounded-xl"
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
                : "text-white not-wishlisted hover:text-red-100 heart-outline"
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
=======

  return (
    <motion.div
      variants={appearVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.025,
        boxShadow: "0 8px 32px 0 rgba(106, 13, 173, 0.13)",
      }}
      className="
        relative bg-gradient-to-br from-gray-50 via-white to-purple-50
        shadow-md hover:shadow-xl
        border border-purple-100
        rounded-2xl
        overflow-hidden
        transition-all duration-300
        group
        max-w-xs w-full mx-auto
        sm:max-w-sm
        p-3 sm:p-4
        "
    >
      {/* Discount Badge */}
      {discount && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm">
          -{discount}%
        </span>
      )}

      {/* Sold Out Overlay */}
      {!available && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20">
          <span className="text-xl font-bold text-gray-400">Sold Out</span>
        </div>
      )}

      {/* Product Image with Hover Effect */}
      <div className="overflow-hidden rounded-xl border border-purple-50 bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-36 sm:h-40 object-cover transform group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="pt-3 pb-1 px-1 flex flex-col gap-1.5">
        <h3 className="text-base sm:text-lg font-semibold text-[#6a0dad] truncate">
          {title}
        </h3>

        {/* Ratings */}
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? "" : "text-gray-300"} />
          ))}
          <span className="text-xs text-gray-400 ml-1">({numReviews})</span>
        </div>

        {/* Category & Condition */}
        <div className="text-xs sm:text-sm text-gray-700 flex flex-wrap gap-2">
          <span className="px-2 py-0.5 bg-[#ede9f9] text-[#6a0dad] rounded-full font-medium border border-purple-100">
            {category}
          </span>
          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-medium border border-purple-100">
            {condition}
          </span>
        </div>

        {/* Price */}
        <div className="mt-1 text-sm flex items-center gap-2">
          <FaRupeeSign className="text-[#6a0dad]" />
          <span className="text-lg font-bold text-[#6a0dad]">{price}</span>
          {originalPrice && (
            <span className="line-through text-gray-400 ml-1 text-xs">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "#fff",
              color: "#6a0dad",
              borderColor: "#b27dd8",
              boxShadow: "0 2px 16px 0 rgba(106,13,173,0.09)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="
              flex-1 text-xs sm:text-sm font-semibold
              bg-[#6a0dad] text-white px-3 py-2
              rounded-lg border border-transparent
              hover:bg-white hover:text-[#6a0dad] hover:border-[#b27dd8]
              transition-all duration-200
              shadow
              
            "
          >
            View Details
          </motion.button>
          <motion.button
            whileHover={
              available
                ? {
                    scale: 1.08,
                    backgroundColor: "#22c55e",
                    boxShadow: "0 2px 12px 0 rgba(34,197,94,0.13)",
                  }
                : {}
            }
            whileTap={available ? { scale: 0.96 } : {}}
            disabled={!available}
            className={`
              flex items-center justify-center
              bg-green-500 hover:bg-green-600 text-white
              px-3 py-2 rounded-lg
              transition-all duration-200
              shadow
              ${!available && "opacity-50 cursor-not-allowed"}
              focus:outline-none focus:ring-2 focus:ring-green-200
            `}
            title={available ? "Add to Cart" : "Not Available"}
          >
            <FaShoppingCart />
          </motion.button>
>>>>>>> Stashed changes
        </div>
      </Link>

      <div className="flex gap-1 m-2">
        <BuyRequestDialogBox imageUrl={imageUrl} product={product} />
      </div>
    </motion.div>
  );
};

export default ProductCard;
