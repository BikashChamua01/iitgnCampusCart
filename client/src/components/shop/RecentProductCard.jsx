import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaTag, FaCheckCircle } from "react-icons/fa";

const RecentProductCard = ({ product }) => {
  const { _id, title, images = [], category, condition } = product;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const slideIntervalRef = useRef(null);

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
    <Link to={`/shop/products/${_id}`}>
      <div
        className="max-w-xs bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer select-none"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        tabIndex={0}
      >
        <div className="relative w-full h-56 overflow-hidden rounded-t-2xl bg-violet-50">
          {images.map((imgObj, idx) => (
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
          <div className="flex gap-1 mt-3 flex-wrap text-xs">
            <span className="flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium text-xs">
              <FaTag className="mr-1" /> {category}
            </span>
            <span
              className={`flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium
                              ${
                                condition == "Poor"
                                  ? "text-red-600 bg-red-300"
                                  : ""
                              }
                              ${
                                condition == "Fair"
                                  ? "text-yellow-700 bg-yellow-100"
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
  );
};

export default RecentProductCard;
