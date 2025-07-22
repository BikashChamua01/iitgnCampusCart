import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../store/product-slice";
import { fetchWishlist } from "@/store/wishlist-slice";
import ProductCard from "../../components/shop/ProductCard";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaBoxOpen, FaFilter, FaSearch } from "react-icons/fa";
import Loader from "@/components/common/Loader";
import { LayoutGrid, Rows3, List, ChevronDown, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const ShopProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  // conver the wishlist array to set
  const wishlistSet = new Set(wishlist.map((product) => product._id));
  console.log("wishlist set in the product page ", wishlistSet);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch, user.userId]);

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "priceLowHigh":
        return a.price - b.price;
      case "priceHighLow":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // wishlis functions
  const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `/api/v1/wishlist/add/${productId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data?.success) {
        dispatch(fetchWishlist());
        return toast.success(
          response.data.msg || "Product successfully added to wishlist"
        );
      } else {
        return toast.error(
          response.data?.msg ||
            response.data?.message ||
            "Failed to add to wishlist"
        );
      }
    } catch (error) {
      console.log("Error in wishlisting Product page", error);
    }
  };

  const deleteFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(
        `/api/v1/wishlist/delete/${productId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data?.success) {
        dispatch(fetchWishlist());
        return toast.success(response.data?.msg || "Removed from wishlist");
      } else
        return toast.error(
          response.data.msg || "Some error occured while wishlisting"
        );
    } catch (error) {
      console.log("Error in addToWishlist ", error);
      return toast.error(
        error?.message || "Some error occured while wishlisting"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 py-4  px-4 w-full relative">
      <div className="max-w-7xl mx-auto ">
        {/* Toolbar */}
        {/* <hr/> */}
        <div className="flex items-center justify-between flex-wrap border rounded-md md:mx-0 pr-4 md:px-10 py-2 mb-8  bg-white md:gap-3  z-50">
          <div>
            <select
              className="bg-white text-sm border border-gray-300 rounded-md pl-1  py-2 focus:outline-none  md:w-auto hidden md:block
            "
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              {/* <option value="rating">Rating</option> */}
            </select>
          </div>

          {/* Product Count */}
          <div className="text-sm text-gray-700 font-semibold">
            {sortedProducts.length} PRODUCTS
          </div>

          {/* Sort & Filter Controls */}
          <div className="">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center text-sm text-fuchsia-600 border border-fuchsia-500 px-8 py-2 rounded-md hover:bg-fuchsia-50 transition"
            >
              <FaFilter className="mr-2" />
              Filter
            </button>
          </div>
        </div>
        {/* <hr className="mb-4"/> */}

        {/* Sidebar Filter */}
        {showFilters && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="fixed top-15.5 right-0 w-80 max-w-[90%] h-full bg-white z-50 shadow-lg p-5 border-l border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                <X />
              </button>
            </div>

            {/* Filters */}
            <div className="space-y-4 ">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-gray-700 ">
                  Search
                </label>
                <div className="flex items-center mt-1 px-2 py-3 border border-gray-300 rounded-md">
                  <FaSearch className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full outline-none bg-transparent text-sm"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md  p-3"
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
              <div className="md:hidden">
                <label className="block text-sm font-medium text-gray-700">
                  Sort
                </label>
                <select
                  className="bg-white text-sm border border-gray-300 rounded-md px-5 py-3 focus:outline-none w-full md:w-auto  "
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="">Sort By</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Product Grid */}
        {loading ? (
          <Loader />
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
            {sortedProducts.length === 0 ? (
              <div className="col-span-full flex flex-col items-center text-gray-500 mt-10">
                <FaBoxOpen size={36} className="mb-2" />
                <p>No products found. Try adjusting your search or filters!</p>
              </div>
            ) : (
              sortedProducts.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <ProductCard
                    product={product}
                    isWishlisted={wishlistSet.has(product._id.toString())}
                    addToWishlist={addToWishlist}
                    deleteFromWishlist={deleteFromWishlist}
                  />
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
