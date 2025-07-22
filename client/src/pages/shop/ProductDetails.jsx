import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "@/components/common/Loader";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FaTag,
  FaCheckCircle,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../store/product-slice";
import ProductCard from "../../components/shop/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageUrl, setImage] = useState(null);
  const [seller, setSeller] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(false);

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.shopProducts);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/v1/products/${id}`);
        setProduct(res.data.product);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const fetchSeller = async () => {
      setSellerLoading(true);
      try {
        const res = await axios.get(
          `/api/v1/users/userProfile/${product.seller}`
        );
        setSeller(res.data.user);
        // console.log(seller);
      } catch (error) {
        console.error("Error fetching seller:", error);
        setSeller(null);
      } finally {
        setSellerLoading(false);
      }
    };
    fetchSeller();
  }, [product]);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  if (loading) return <Loader />;

  if (!product)
    return (
      <div className="text-center mt-10 text-lg text-gray-500">
        Product not found
      </div>
    );

  const {
    title,
    description,
    price,
    originalPrice,
    category,
    condition,
    images = [],
  } = product;

  const similarProducts = products.filter(
    (p) => p.category === category && p._id !== product._id
  );

  return (
    <div className="min-h-screen  py-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Image + Details */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 bg-gradient-to-br from-purple-50 to-purple-50 p-4 sm:p-6 rounded-lg items-center">
          {/* Product Image */}
          <motion.div
            className="md:w-1/2 flex flex-col items-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative w-full max-w-md mx-auto">
              <img
                src={currentImageUrl || images[0]?.url || "/placeholder.png"}
                alt={title}
                className="rounded-xl w-full h-66 sm:h-80 object-contain"
              />
              {originalPrice && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow">
                  {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                  OFF
                </span>
              )}
            </div>

            {/* Thumbnail gallery (scrollable on mobile) */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 flex-nowrap overflow-x-auto max-w-full scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`img-${i}`}
                    className={`h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      (currentImageUrl || images[0]?.url) === img.url
                        ? "border-purple-500 ring-2 ring-purple-300"
                        : "border-gray-200"
                    }`}
                    onClick={() => setImage(img.url)}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details + Seller Info */}
          <div className="md:w-1/2 flex flex-col justify-between space-y-6">
            <motion.div
              className="bg-purple-50 rounded-xl shadow p-4 sm:p-5 flex flex-col gap-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-1">
                  {title}
                </h2>
                <p className="text-gray-700 text-sm sm:text-base mb-4 break-words leading-relaxed">
                  {description}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-xl sm:text-2xl font-bold text-purple-700">
                    ₹{price}
                  </span>
                  {originalPrice && (
                    <span className="line-through text-gray-400 text-lg">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-3 flex-wrap text-sm">
                  <span className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                    <FaTag className="mr-1" /> {category}
                  </span>
                  <span
                    className={`flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium
                    ${condition == "Poor" ? "text-red-600 bg-red-300" : ""}
                    ${
                      condition == "Fair" ? "text-yellow-700 bg-yellow-100" : ""
                    }
                    `}
                  >
                    <FaCheckCircle className="mr-1" /> {condition}
                  </span>
                </div>
              </div>

              {/* Seller Info */}
              {seller && !sellerLoading && (
                <div
                  className={`flex items-center gap-4 bg-white rounded-lg p-4 shadow-inner
                
                `}
                >
                  <img
                    src={
                      (seller.profilePicture && seller.profilePicture.url) ||
                      "/images/user-avatar.png"
                    }
                    alt={seller.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-purple-300"
                  />
                  <div>
                    <div className="text-base sm:text-lg font-semibold text-purple-800 flex items-center gap-2">
                      <FaUserCircle /> {seller.name}
                    </div>
                    <div className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                      <FaEnvelope /> {seller.email}
                    </div>
                    <div className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                      <FaPhone /> {seller.phoneNumber}
                    </div>
                    <Link
                      to={`/user/${seller._id}`}
                      className="inline-block mt-1 text-purple-600 font-semibold hover:underline text-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>

            <button
              className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-xl font-semibold shadow hover:scale-105 transition-transform cursor-pointer 
               
              `}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Similar Products */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-4">
            Similar Products
          </h3>
          {similarProducts.length === 0 ? (
            <div className="text-gray-500">No similar products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {similarProducts.map((sp) => (
                <ProductCard key={sp._id} product={sp} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
