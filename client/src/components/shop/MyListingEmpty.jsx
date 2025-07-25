import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBoxOpen,
  FaImage,
  FaTshirt,
  FaLaptop,
} from "react-icons/fa";

// Animated, themed illustration for an empty shop/products shelf
const ShelfIllustration = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 180"
    className="w-64 h-48 mb-2 mx-auto"
    initial="hidden"
    animate="visible"
  >
    {/* Shelf base */}
    <motion.rect
      x="40"
      y="130"
      width="220"
      height="20"
      rx="6"
      fill="#ede9fe"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
    />
    {/* Box with bounce */}
    <motion.g
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: [20, 10, 20], opacity: 1 }}
      transition={{
        delay: 0.8,
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      <rect x="120" y="90" width="60" height="40" rx="5" fill="#a78bfa" />
      <rect x="130" y="80" width="40" height="20" rx="4" fill="#c4b5fd" />
      {/* 3D lid */}
      <polygon points="130,80 150,65 170,80 170,80" fill="#ddd6fe" />
    </motion.g>
    {/* Floating item icons */}
    <motion.g>
      {/* T-shirt */}
      <motion.g
        initial={{ scale: 0, x: -20, y: -20, opacity: 0 }}
        animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <FaTshirt
          x={80}
          y={45}
          size={28}
          color="#8b5cf6"
          style={{ position: "absolute" }}
        />
      </motion.g>
      {/* Laptop */}
      <motion.g
        initial={{ scale: 0, x: 40, y: -10, opacity: 0 }}
        animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <FaLaptop
          x={210}
          y={48}
          size={26}
          color="#a3a3f3"
          style={{ position: "absolute" }}
        />
      </motion.g>
      {/* Photo frame */}
      <motion.g
        initial={{ scale: 0, x: 0, y: -30, opacity: 0 }}
        animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <FaImage
          x={150}
          y={30}
          size={24}
          color="#7c3aed"
          style={{ position: "absolute" }}
        />
      </motion.g>
    </motion.g>
    {/* Sparking star */}
    <motion.circle
      cx="200"
      cy="45"
      r="6"
      fill="#facc15"
      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.8, repeat: Infinity }}
    />
  </motion.svg>
);

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      staggerChildren: 0.06,
    },
  },
};

const MyListingsEmpty = () => {
  return (
    <motion.main
      className="min-h-[70vh] flex flex-col justify-center items-center px-6 text-center rounded-3xl max-w-3xl mx-auto py-14"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      aria-label="My listings empty state"
    >
      <ShelfIllustration />
      <motion.h1
        className="text-3xl font-extrabold text-violet-800 mb-4"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        You Haven&apos;t Listed Anything Yet!
      </motion.h1>

      <motion.p
        className="text-violet-600 mb-8 text-lg max-w-md"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3 }}
      >
        {" "}
        Upload your first products. Pass it on—let what’s no longer useful to you become someone else’s treasure.
      </motion.p>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
      >
        <Link
          to={"/shop/sell"}
          className="inline-flex items-center space-x-3 rounded-full bg-violet-600 hover:bg-violet-700 px-4 py-2 text-white font-semibold shadow-lg transition-colors select-none"
        >
          <span
          >
            Sell Product
          </span>
          {/* Circle with animated arrow inside, more bouncy */}
          <motion.span
            className="flex items-center justify-center rounded-full bg-white text-violet-700 w-6 h-6 ml-1"
            animate={{
              scale: [1, 1.13, 1],
              boxShadow: [
                "0 0 0 0 #a78bfa55",
                "0 0 0 6px #a78bfa22",
                "0 0 0 0 #a78bfa55",
              ],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
              }}
            >
              {" "}
              <FaArrowRight />
            </motion.div>
          </motion.span>
        </Link>
      </motion.div>
    </motion.main>
  );
};

export default MyListingsEmpty;
