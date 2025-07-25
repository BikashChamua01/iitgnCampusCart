import React from "react";
import ImageCarousel from "@/components/shop/CarouselHome";
import { useNavigate } from "react-router-dom";
import { categories } from "@/utils/formDatas";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import RecentProductCard from "@/components/shop/RecentProductCard";
import { Link } from "react-router-dom";

// Category image mapping with slight softness in images (optional)
const categoryImages = {
  Books:
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  Electronics:
    "https://img.freepik.com/premium-photo/high-angle-view-computer-keyboard-table_1048944-18670532.jpg?semt=ais_hybrid&w=740",
  Clothing:
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
  Furniture:
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=80",
  Cycle:
    "https://5.imimg.com/data5/SELLER/Default/2024/9/454921310/UZ/HD/XJ/232895434/hero-colt-sports-bicycle.jpg",
  Stationery:
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
  Others:
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
};

const sectionTitleVariants = {
  hidden: { opacity: 0, y: 38 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 1, 0.29, 1] },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, ease: [0.23, 1, 0.32, 1] },
  },
};

const recentContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const recentCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Home = () => {
  const storage_name = "CAMPUSCART-FILTER";
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.shopProducts);
  const recentlyAddedProducts = products.slice(0, 10);

  const handleCategoryClick = (cat) => {
    localStorage.setItem(storage_name, JSON.stringify([cat]));
    navigate("/shop/products");
  };

  return (
    <main className="min-h-screen w-full pt-6 pb-16 px-2">
      {/* Banner Carousel */}
      <section className="w-full  mx-auto md:px-6">
        <ImageCarousel />
      </section>

      {/* Shop by Categories */}
      <section className="w-full max-w-8xl mx-auto mt-10 px-4 md:px-15 py-8 bg-violet-50/50 rounded-3xl ">
        <motion.h3
          className="text-2xl md:text-3xl font-extrabold mb-8 text-violet-700 text-center tracking-wide"
          variants={sectionTitleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
        >
          Shop by Categories
        </motion.h3>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {categories.map((cat) => (
            <motion.div key={cat} variants={cardVariants}>
              <div
                onClick={() => handleCategoryClick(cat)}
                className="flex flex-col items-center bg-white/95 shadow-md rounded-xl py-3 px-2 cursor-pointer ring-1 ring-violet-100 hover:ring-violet-400 hover:shadow-lg transition-all duration-300 group select-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleCategoryClick(cat)}
                aria-label={`Shop by category ${cat}`}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-violet-100 mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={categoryImages[cat]}
                    alt={cat}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <span className="text-sm md:text-base font-semibold text-violet-700 group-hover:text-violet-900 text-center truncate">
                  {cat}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Recently Added Products */}
      <section className="w-full max-w-7xl mx-auto md:mt-8 px-1 md:px-2 py-4  bg-white items-center">
        <motion.h3
          className="text-2xl md:text-3xl font-extrabold mb-8 text-violet-700 text-center tracking-wide"
          variants={sectionTitleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
        >
          Recently Added Products
        </motion.h3>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
          variants={recentContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {recentlyAddedProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 text-lg py-20">
              No recent products found.
            </p>
          ) : (
            recentlyAddedProducts.map((product) => (
              <motion.div
                key={product._id}
                variants={recentCardVariants}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <RecentProductCard product={product} />
              </motion.div>
            ))
          )}
        </motion.div>

        <div className="flex justify-center mt-6">
          <Link
            to={"/shop/products"}
            className="inline-flex items-center space-x-3 rounded-full bg-violet-600 hover:bg-violet-700 px-3 py-2 text-white font-semibold shadow-lg transition-colors select-none"
          >
            <span>Explore More</span>
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
      </section>
    </main>
  );
};

export default Home;
