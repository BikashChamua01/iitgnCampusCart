import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../store/product-slice";
import { fetchWishlist } from "@/store/wishlist-slice";
import ProductCard from "../../components/shop/ProductCard";
import FilterSidebar from "@/utils/FilterSidebar";
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
        <div className="flex flex-wrap items-center justify-between bg-white  py-2 px-4 md:px-10 mb-8 border-b-1 border-violet-100 md:gap-6 z-50">
          {/* Sort Select (desktop) */}
          <div className="hidden md:block text-sm text-violet-700 border border-violet-600 rounded-md overflow-hidden">
            <select
              className="bg-white text-sm rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1 focus:ring-offset-white cursor-pointer transition"
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

          {/* Centered Product Count */}
          <div className="flex-1 flex justify-center">
            <div className="text-sm font-semibold text-violet-700 bg-violet-100/60 rounded-full px-5 py-1 shadow-inner select-none tracking-wide">
              {sortedProducts.length} PRODUCTS
            </div>
          </div>

          {/* Filter Button */}
          <div>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center text-sm text-violet-700 border border-violet-600 px-6 py-2 rounded-md shadow-sm hover:bg-violet-50 transition"
            >
              <FaFilter className="mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Sidebar Filter */}
        {showFilters && (
          <FilterSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2
                  id="filter-sidebar-title"
                  className="text-lg font-semibold text-violet-800"
                >
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-800 focus:outline-none"
                  aria-label="Close filter sidebar"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Filters */}
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label
                    htmlFor="search-input"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Search
                  </label>
                  <div className="mt-1 flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-violet-400 focus-within:border-violet-400 transition">
                    <FaSearch className="text-gray-400 mr-2 flex-shrink-0" />
                    <input
                      id="search-input"
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full bg-transparent outline-none text-sm text-gray-900"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category-select"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    id="category-select"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition cursor-pointer"
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

                {/* Sort for mobile only */}
                <div className="md:hidden">
                  <label
                    htmlFor="sort-select-mobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sort
                  </label>
                  <select
                    id="sort-select-mobile"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition cursor-pointer"
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
            </div>
          </FilterSidebar>
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
