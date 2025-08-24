import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/store/wishlist-slice";
import ProductCard from "../../components/shop/ProductCard";
import FilterSidebar from "@/utils/FilterSidebar";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaBoxOpen, FaFilter, FaSearch } from "react-icons/fa";
import Loader from "@/components/common/Loader";
import {
  LayoutGrid,
  Rows3,
  List,
  ChevronDown,
  X,
  AwardIcon,
} from "lucide-react";
import { Filter } from "@/components/shop/Filter";
import { Button } from "@/components/ui/button";
import { SortDropDown } from "@/components/shop/Filter";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { toast } from "sonner";

const ShopProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const storage_name = "CAMPUSCART-FILTER";

  const [search, setSearch] = useState(""); // raw search input
  const [debouncedSearch, setDebouncedSearch] = useState(search); // debounced value
  const [sortOption, setSortOption] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showBuyRequests, setShowBuyRequests] = useState(false);
  const [buyRequests, setBuyRequests] = useState(new Set([]));

  // conver the wishlist array to set
  const wishlistSet = new Set(wishlist?.map((product) => product._id));

  const categories = [...Array.from(new Set(products?.map((p) => p.category)))];
  categories.sort();

  // Get the wishlist
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch, user.userId]);

  // Load saved filters from localStorage
  useEffect(() => {
    const data = localStorage.getItem(storage_name);
    const overAllFilter = JSON.parse(data);
    if (overAllFilter) {
      setFilter([...overAllFilter.filter]);
      setShowBuyRequests(overAllFilter.showBuyRequests);
    } else {
      setFilter([]);
      setShowBuyRequests(false);
    }
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    const overAllFilter = {
      showBuyRequests,
      filter,
    };
    localStorage.setItem(storage_name, JSON.stringify(overAllFilter));
  }, [filter, showBuyRequests]);

  // Toggle isFiltered flag
  useEffect(() => {
    if (filter.length === 0 && sortOption === "" && !showBuyRequests) {
      setIsFiltered(false);
    } else {
      setIsFiltered(true);
    }
  }, [filter, sortOption, showBuyRequests]);

  // Fetch buy requests
  useEffect(() => {
    const fetchBuyRequests = async () => {
      try {
        const response = await axios.get(
          `https://iitgn-campus-cart-backend.vercel.app/api/v1/wishlist/get-buy-requests/${user.userId}`
        );
        if (response.data.success === false) {
          toast.error("Error in getting the products");
          return;
        }
        setBuyRequests(new Set(response.data.buyRequests));
      } catch (error) {
        console.log(error);
      }
    };
    fetchBuyRequests();
  }, [user.userId]);

  // Debounce the search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Filter products by debouncedSearch, category filter, and buy requests
  const filteredProducts =
    filter.length === 0
      ? products.filter((product) =>
          product.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      : products.filter((product) => {
          const cat = product.category;
          return (
            (filter.includes("All") || filter.includes(cat)) &&
            product.title.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        });

  // Sort the filtered products
  let sortedProducts = [...filteredProducts].sort((a, b) => {
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

  // Apply buyRequests filter if enabled
  if (showBuyRequests) {
    sortedProducts = sortedProducts.filter((p) =>
      buyRequests?.has(p._id.toString())
    );
  }

  // Clear all filters
  const clearFilter = () => {
    setFilter([]);
    setSortOption("");
    setSearch("");
    setShowFilters(false);
    setShowBuyRequests(false);
  };

  // Handle filter/clear button click
  const handleFilterClick = () => {
    if (isFiltered) return clearFilter();
    setShowFilters(true);
  };

  // Toggle buy requests filter
  const handleShowBuyRequests = () => {
    setShowBuyRequests((prev) => !prev);
  };

  return (
    <div className="min-h-screen py-4 px-4 w-full relative">
      <div className="max-w-7xl mx-auto">
        {/* Toolbar */}
        <div className="flex items-center bg-white py-2 px-4 md:px-10 mb-8 border-b border-violet-100 md:gap-6 z-50">
          {/* Product Count */}
          <div className="flex-1 flex justify-start">
            <div className="text-sm font-semibold text-violet-700 bg-violet-100/60 rounded-full px-5 py-1 shadow-inner select-none tracking-wide">
              {sortedProducts.length} PRODUCTS
            </div>
          </div>

          {/* Filter Button */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={handleFilterClick}
              className={`flex items-center text-sm cursor-pointer border ${
                !isFiltered
                  ? "border-violet-600 text-violet-700"
                  : "border-red-600 text-red-700"
              } px-3 py-1 rounded-md shadow-sm hover:bg-violet-50 transition`}
            >
              <FaFilter className="mr-2" />
              {!isFiltered ? "Filter" : "Clear Filter"}
            </button>
          </div>
        </div>

        {/* Sidebar Filter */}
        {showFilters && (
          <FilterSidebar
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          >
            <div className="relative h-full flex flex-col w-full p-2 transition-all duration-300">
              {/* Header */}
              <div className="flex justify-between items-center mb-2 md:mb-8">
                <h2
                  id="filter-sidebar-title"
                  className="text-xl font-bold text-violet-800 tracking-tight"
                >
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-violet-400 hover:text-violet-700 rounded-full p-2 bg-violet-50 hover:bg-violet-100 shadow focus:ring-2 focus:ring-violet-200 transition cursor-pointer"
                  aria-label="Close filter sidebar"
                >
                  <X size={26} />
                </button>
              </div>

              {/* Filters */}
              <div className="space-y-3 md:space-y-8 flex-1">
                {/* My Buy Requests */}
                <div>
                  <Label
                    htmlFor="buy-requests"
                    className="flex items-center gap-3 rounded-md transition cursor-pointer group w-fit"
                  >
                    <span className="mb-2 text-md font-medium text-violet-700">
                      Show Buy Requests
                    </span>
                    <Checkbox
                      checked={showBuyRequests}
                      onCheckedChange={handleShowBuyRequests}
                      className="accent-violet-600 w-5 h-5 min-w-[20px] min-h-[20px] rounded-md border-gray-300 group-hover:border-violet-500 shadow-sm focus:ring-2 focus:ring-violet-200 transition cursor-pointer"
                    />
                  </Label>
                </div>

                {/* Search */}
                <div>
                  <label
                    htmlFor="search-input"
                    className="mb-2 text-md font-medium text-violet-700"
                  >
                    Search
                  </label>
                  <div className="flex items-center gap-2 rounded-xl px-4 py-2 border border-gray-200 hover:border-violet-300 bg-white/90 shadow-inner focus-within:ring-2 focus-within:ring-violet-200 transition mt-1">
                    <FaSearch className="text-violet-300 transition group-hover:text-violet-500" />
                    <input
                      id="search-input"
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search products..."
                      className="w-full bg-transparent outline-none border-none text-base text-gray-800 placeholder-gray-400 focus:placeholder-violet-300 transition"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label
                    htmlFor="sort-select-mobile"
                    className="mb-2 text-md font-medium text-violet-700"
                  >
                    Sort
                  </label>
                  <select
                    id="sort-select-mobile"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="block w-full rounded-xl px-4 py-2 bg-white/90 text-gray-800 border border-gray-200 hover:border-violet-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition cursor-pointer mt-1 appearance-none pr-10"
                  >
                    <option value="" className="font-extralight">
                      Sort By
                    </option>
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <Filter
                    categories={categories}
                    filter={filter}
                    setFilter={setFilter}
                  />
                </div>
              </div>

              {/* Clear Filter Button */}
              <Button className="custom-button" onClick={clearFilter}>
                Clear Filter
              </Button>
            </div>
          </FilterSidebar>
        )}

        {/* Product Grid */}
        {loading ? (
          <Loader />
        ) : (
          <motion.div
            className="grid gap-1 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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
              sortedProducts?.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <ProductCard
                    product={product}
                    isWishlisted={wishlistSet.has(product._id.toString())}
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
