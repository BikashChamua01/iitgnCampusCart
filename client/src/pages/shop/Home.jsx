// src/pages/Home.jsx
import React from "react";
import ImageCarousel from "@/components/shop/CarouselHome";

import { Link, useNavigate } from "react-router-dom";
import { categories } from "@/utils/formDatas";
import { motion, AnimatePresence } from "framer-motion";


// Category image url mapping (swap for your real images)
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

// Define animation variants for the cards
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.3 } },
};

const Home = () => {
  const storage_name = "CAMPUSCART-FILTER";
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    localStorage.setItem(storage_name, JSON.stringify(cat));
    navigate("/shop/products");
  };
  return (
    <main className="min-h-screen pb-16 w-full mt-3 md:mt-5">
      {/* Banner Carousel */}
      <section className="w-full mx-auto px-2 md:px-6 ">
        <ImageCarousel />
      </section>

      {/* Shop by Categories */}
      <section className="max-w-7xl mx-auto px-2 md:px-6 py-8">
        <h3 className="text-xl md:text-2xl font-bold mb-5 text-violet-800 text-center">
          Shop by Categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 md:gap-6">
          <AnimatePresence>
            {categories.map((cat) => (
              <motion.div
                key={cat}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <div onClick={() => handleCategoryClick(cat)}>
                  <div className="flex flex-col items-center shadow rounded-xl p-2 pb-3 bg-white/90 ring-1 ring-violet-100 hover:ring-violet-400 transition hover:shadow-lg group cursor-pointer">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-violet-100 mb-2 flex items-center justify-center">
                      <img
                        src={categoryImages[cat]}
                        alt={cat}
                        className="object-cover w-full h-full transition group-hover:scale-105"
                      />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-violet-700 group-hover:text-violet-900 text-center">
                      {cat}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
};

export default Home;
