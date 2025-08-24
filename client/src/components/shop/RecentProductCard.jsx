import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaTag, FaCheckCircle, FaHeart, FaBan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, deleteFromWishlist } from "@/store/wishlist-slice";

const RecentProductCard = ({ product, wishlist = false }) => {
  const { _id, title, images = [], category, condition, soldOut } = product;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const slideIntervalRef = useRef(null);

  const dispatch = useDispatch();
  const { wishlist: wishlistItems } = useSelector((state) => state.wishlist);
  const wishlistSet = new Set(wishlistItems?.map((item) => item._id));
  const isWishlisted = wishlistSet.has(_id.toString());

  const handleWishlistToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isWishlisted) {
      dispatch(deleteFromWishlist(_id));
    } else {
      dispatch(addToWishlist(_id));
    }
  };

  useEffect(() => {
    if (hovering && images.length > 1) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    } else {
      setCurrentIndex(0);
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    }

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [hovering, images.length]);

  return (
    <div className="relative">
      {/* Watermark Overlay if Sold Out */}
      {soldOut && (
        <div className="absolute inset-0 z-20 bg-transparent flex flex-col items-center justify-center pointer-events-none">
         
          <span className="transform -rotate-45 text-4xl font-extrabold text-red-700 opacity-50 flex justify-around w-full">
            SOLD OUT  <FaBan className=" mt-2" />
          </span>
        </div>
      )}

      {/* Card Content - Disable clicks if soldOut */}
      <div className={soldOut ? "pointer-events-none" : ""}>
        <Link to={`/shop/products/${_id}`}>
          <div
            className="max-w-xs bg-white rounded-sm sm:rounded-2xl shadow-lg overflow-hidden cursor-pointer select-none"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            tabIndex={0}
          >
            <div className="relative w-full h-56 overflow-hidden rounded-t-2xl bg-violet-50">
              {/* Wishlist Heart Icon (toggleable) */}
              {wishlist && (
                <button
                  onClick={handleWishlistToggle}
                  className="absolute top-2 right-2 bg-white bg-opacity-80 p-1 rounded-full shadow-md z-10 pointer-events-auto"
                  aria-label="Toggle Wishlist"
                >
                  <FaHeart
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isWishlisted
                        ? "text-red-600"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                  />
                </button>
              )}

              {images?.map((imgObj, idx) => (
                <img
                  key={idx}
                  src={imgObj?.url}
                  alt={`${title} ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    idx === currentIndex
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                  loading="lazy"
                  draggable={false}
                />
              ))}

              {images.length === 0 && (
                <div className="flex items-center justify-center h-full text-violet-200 select-none">
                  No Image
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col space-y-1 text-xs">
              <h3
                className="text-lg font-semibold text-violet-800 truncate"
                title={title}
              >
                {title}
              </h3>
              <div className="flex-row sm:flex gap-1 mt-3 flex-wrap text-xs">
                <span className="flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium text-xs my-1">
                  <FaTag className="mr-1" /> {category}
                </span>
                <span
                  className={`flex items-center px-2 py-1 rounded-full font-medium text-xs my-1
                    ${condition === "Poor" ? "text-red-600 bg-red-300" : ""}
                    ${condition === "Fair" ? "text-yellow-700 bg-yellow-100" : ""}
                    ${condition === "New" ? "text-blue-700 bg-blue-100" : ""}
                    ${condition === "Like New" ? "text-blue-700 bg-sky-300" : ""}
                    ${
                      ["Good", "Excellent"].includes(condition)
                        ? "text-green-700 bg-green-100"
                        : ""
                    }
                  `}
                >
                  <FaCheckCircle className="mr-1" /> {condition}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RecentProductCard;
