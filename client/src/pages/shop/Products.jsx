import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../store/product-slice";
import ProductCard from "../../components/shop/ProductCard";
import { motion } from "framer-motion";
import { FaSearch, FaBoxOpen } from "react-icons/fa";

const ShopProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.shopProducts);

  // Extract unique categories for filter dropdown
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  // State for search and category filter
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Filter products based on search and category
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br py-4 px-4 w-full">
      <div className="max-w-9xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-[#6a0dad] text-center mb-10">
          Explore All Products
        </h1> */}

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center bg-white rounded-2xl shadow px-3 py-2 w-full md:w-1/3 border border-fuchsia-500">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none w-full bg-transparent "
            />
          </div>
          <select
            className="bg-white  rounded-md px-3 py-2 shadow w-full md:w-1/4 border border-fuchsia-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <svg
              className="animate-spin h-10 w-10 text-[#6a0dad]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
        ) : (
          <motion.div
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {filteredProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center text-gray-500 mt-10">
                <FaBoxOpen size={36} className="mb-2" />
                <p>No products found. Try adjusting your search or filters!</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ShopProducts;
