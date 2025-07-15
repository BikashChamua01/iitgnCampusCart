import React from "react";
import { FaRupeeSign, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ProductCard = ({ product }) => {
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

  // Framer Motion + InView Setup
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,       // Trigger when 20% visible
    triggerOnce: false,   // Allow re-triggering
  });

  React.useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
      });
    } else {
      controls.start({
        opacity: 0,
        y: 50,
        transition: { duration: 0.4, ease: "easeIn" },
      });
    }
  }, [inView, controls]);

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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
    >
      <Link
        to={`/shop/products/${_id}`}
        className="group block bg-white rounded-xl border p-1 border-[#e2d3f3] overflow-hidden shadow-sm hover:shadow-md transition duration-300 w-full max-w-xs mx-auto"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-105 rounded-xl"
          />
          {discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow z-10">
              -{discount}%
            </span>
          )}
          {!available && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20">
              <span className="text-base font-bold text-gray-500">Sold Out</span>
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
              <FaStar key={idx} className={idx < rating ? "" : "text-gray-300"} />
            ))}
            <span className="text-xs text-gray-500 ml-1">({numReviews})</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full">
              {category}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full ${getConditionStyles(condition)}`}
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
    </motion.div>
  );
};

export default ProductCard;
