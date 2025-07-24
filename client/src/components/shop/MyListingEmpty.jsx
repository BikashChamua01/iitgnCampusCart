import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

// You can replace this with your own illustration or use something like Undraw, HeroIcons etc.
const EmptyBoxIllustration = () => (
  <svg
    className="w-64 h-64 mb-8 mx-auto text-violet-300"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 64 64"
    stroke="currentColor"
  >
    <rect
      x="12"
      y="20"
      width="40"
      height="24"
      rx="2"
      ry="2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20l20 15 20-15"
    />
    <path
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 44v4a2 2 0 002 2h20a2 2 0 002-2v-4"
    />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const MyListingsEmpty = () => {
  return (
    <motion.main
      className="min-h-[70vh] flex flex-col justify-center items-center px-6 text-center  rounded-3xl max-w-3xl mx-auto  py-14"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      aria-label="My listings empty state"
    >
      <EmptyBoxIllustration />

      <h1 className="text-3xl font-extrabold text-violet-800 mb-4">
        You Have Not Listed Any Products Yet
      </h1>
      <p className="text-violet-600 mb-8 text-lg max-w-md">
        Start selling your products to reach thousands of buyers looking for
        great deals.
      </p>

      <div className="flex justify-center">
                <Link
                  to={"/shop/sell"}
                  className="inline-flex items-center space-x-3 rounded-full bg-violet-600 hover:bg-violet-700 px-3 py-2 text-white font-semibold shadow-lg transition-colors select-none"
                >
                  <span>Sell Product</span>
                  {/* Circle with animated arrow inside */}
                  <motion.span
                    className="flex items-center justify-center rounded-full bg-white text-violet-600 w-6 h-6"
                    aria-hidden="true"
                  >
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "easeInOut",
                      }}
                    >
                      <FaArrowRight />
                    </motion.div>
                  </motion.span>
                </Link>
              </div>
    </motion.main>
  );
};

export default MyListingsEmpty;
