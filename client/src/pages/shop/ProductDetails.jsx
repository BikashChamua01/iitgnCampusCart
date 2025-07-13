import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaTag,
  FaCheckCircle,
  FaUserCircle,
  FaEnvelope,
  FaUser,
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

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.shopProducts);

  // Fetch this product
  useEffect(() => {
    axios.get(`/api/v1/products/${id}`).then((res) => {
      setProduct(res.data.product);
      setLoading(false);
    });
  }, [id]);

  // Fetch seller
  useEffect(() => {
    if (product) {
      axios.get(`/api/v1/auth/userProfile/${product.seller}`).then((res) => {
        setSeller(res.data.user);
      });
    }
  }, [product]);

  // Fetch all products for similar products
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
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

  // Filter similar products (same category, not this product)
  const similarProducts = products
    .filter(
      (p) => p.category === category && p._id !== product._id // Exclude current product
    )
    .slice(0, 4); // Show up to 4 similar products

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-10 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Row: Image | Details+Seller */}
        <div className="flex flex-col md:flex-row gap-8 bg-white   p-4 md:p-8">
          {/* Product Image */}
          <motion.div
            className="md:w-1/2 flex flex-col items-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative w-full max-w-md">
              <img
                src={currentImageUrl || images[0]?.url || "/placeholder.png"}
                alt={title}
                className="rounded-xl w-full h-80 object-cover shadow-lg border-2 border-purple-100"
              />
              {originalPrice && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                  OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`img-${i}`}
                    className={`h-16 w-16 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      (currentImageUrl || images[0]?.url) === img.url
                        ? "border-purple-500 ring-2 ring-purple-300"
                        : "border-transparent"
                    }`}
                    onClick={() => setImage(img.url)}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Details + Seller */}
          <div className="md:w-1/2 flex flex-col justify-between">
            {/* Card: Product Details + Seller */}
            <motion.div
              className="bg-purple-50 rounded-xl shadow p-5 flex flex-col gap-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Product Details */}
              <div>
                <h2 className="text-3xl font-extrabold text-purple-800 mb-2">
                  {title}
                </h2>
                <p className="text-gray-700 text-base mb-4 break-words">{description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-purple-700">
                    ₹{price}
                  </span>
                  {originalPrice && (
                    <span className="line-through text-gray-400 text-lg">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 mt-2 flex-wrap">
                  <span className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium text-sm">
                    <FaTag className="mr-1" /> {category}
                  </span>
                  <span className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium text-sm">
                    <FaCheckCircle className="mr-1" /> {condition}
                  </span>
                </div>
              </div>
              {/* Seller Details */}
              {seller && (
                <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-inner ">
                  <img
                    src={seller.avatar || "/user-avatar.png"}
                    alt={seller.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-purple-300"
                  />

                  <div>
                    <div className="text-lg font-bold text-purple-800 flex items-center gap-2">
                      <FaUserCircle /> {seller.name}
                    </div>

                    <div className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                      <FaEnvelope /> {seller.email}
                    </div>

                    <Link
                      // to={`/user/${seller._id}`}
                      to={`#`}
                      className="inline-block mt-2 text-purple-600 font-semibold hover:underline text-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
            {/* Add to Cart Button (outside the card, below it) */}
            <button className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 transition-transform cursor-pointer">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-purple-800 mb-6">
            Similar Products
          </h3>
          {similarProducts.length === 0 ? (
            <div className="text-gray-500">No similar products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
