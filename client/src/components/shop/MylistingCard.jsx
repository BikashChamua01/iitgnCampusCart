/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import ConfirmDialog from "./ConfirmDialogButton";
import { Link } from "react-router-dom";
// import InterestedBuyersDialogBox from "./InterestedBuyersDialogBox";
import { User } from "lucide-react";
import { toast } from "sonner";

const MyListingCard = ({ product, onEdit, onDelete, isAdmin }) => {
  const {
    _id: productId,
    title,
    description,
    images,
    price,
    originalPrice,
    category,
    condition,
    soldOut,
  } = product;

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.01 }}
      whileHover={{
        scale: 1.01,
        boxShadow: "0 2px 20px 0 rgba(168, 85, 247, 0.25)",
      }}
      className="relative bg-white rounded-xl shadow-lg p-4 sm:p-5 overflow-visible mt-16 sm:mt-20 self-center mx-7 lg:mx-0 transition-all duration-300 ease-in-out hover:shadow-purple-400/40 cursor-pointer h-70"
    >
      {/* Image and content  inside Link */}
      <Link
        to={
          !isAdmin
            ? `/shop/products/${product._id}`
            : `/admin/products/${product._id}`
        }
        className="block"
      >
        {/* Circle image */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src={images[0]?.secure_url || images[0]?.url}
            alt={title}
            className="w-30 h-30 sm:w-34 sm:h-34 rounded-full object-cover border-4 border-purple-200 shadow-md transition-all duration-300 group-hover:shadow-purple-300"
          />
        </div>

        {/* Content */}
        <div className="mt-12 flex flex-col justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 text-center truncate">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-2 line-clamp-2 h-10 flex items-start justify-center">
            {truncateText(description, 70)}
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            <span className="bg-purple-100 text-purple-800 text-xs font-medium rounded-full px-2 py-0.5">
              {category}
            </span>
            <span className="bg-purple-50 text-purple-700 text-xs font-medium rounded-full px-2 py-0.5">
              {condition}
            </span>
          </div>
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-lg font-bold text-purple-800">₹{price}</span>
            {originalPrice && originalPrice !== price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons (Edit & Delete) outside the Link */}
      <div>
        <div className=" bottom-3 right-3 left-3 flex gap-2 mt-2 mb-5">
          {!soldOut && <motion.button
            whileHover={{
              scale: 1.06,
              boxShadow: "0 2px 12px 0 rgba(168, 85, 247, 0.25)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onEdit(productId)}
            className={`${
              isAdmin ? "hidden" : "block"
            } flex-1 py-1 text-xs font-medium rounded-full bg-purple-200 text-purple-800 hover:bg-purple-300 hover:shadow-lg hover:shadow-purple-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer`}
          >
            Edit
          </motion.button>}
          {soldOut && <motion.button
            whileHover={{
              scale: 1.06,
              boxShadow: "0 2px 12px 0 rgba(168, 85, 247, 0.25)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => toast.warning("You Sold this Product successfully!") }
            className={`${
              isAdmin ? "hidden" : "block"
            } flex-1 py-1 text-xs font-medium rounded-full bg-purple-200 text-purple-800 hover:bg-purple-300 hover:shadow-lg hover:shadow-purple-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer`}
          >
            Sold Out
          </motion.button>}
          <ConfirmDialog onConfirm={() => onDelete(productId)} msg="This action cannot be undone. This will permanently delete your product." title="Delete" />
        </div>
        
      </div>
    </motion.div>
  );
};

export default MyListingCard;