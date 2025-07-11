// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { current } from "@reduxjs/toolkit";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageurl, setImage] = useState(null);

  useEffect(() => {
    axios.get(`/api/v1/products/${id}`).then((res) => {
      setProduct(res.data.product);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!product) return <div className="text-center mt-10">Product not found</div>;

  // const {  description, price, originalPrice, category, condition, images = [] } = product;
  console.log(product);
  const title = product.title;
  const description= product.description;
  const price = product.price;
  const originalPrice = product.originalPrice;
  const  category = product.category;
  const  condition = product.condition;
  const images = product.images;

  console.log(condition, category)


  return (
    <div className="min-h-screen  py-10 px-4">
      <div className="max-w-5xl mx-auto  p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Images */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={currentImageurl || images[0]?.url || "/placeholder.png"}
              alt={title}
              className="rounded-xl w-full h-80 object-cover shadow"
            />
            {/* Optional: Show thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`img-${i}`}
                    className="h-16 w-16 object-cover rounded shadow"
                    onClick={e=>setImage(img.url)}
                    
                   
                  />
                ))}
                
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            className="flex-1 flex flex-col gap-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-[#6a0dad]">{title}</h2>
            <p className="text-gray-700">{description}</p>

            <div className="text-lg text-[#6a0dad] font-semibold">
              ₹{price}
              {originalPrice && (
                <span className="ml-3 line-through text-sm text-gray-500">₹{originalPrice}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-2 text-sm">
              <span className="bg-[#f3e8ff] text-[#6a0dad] px-3 py-1 rounded-full font-medium">
                Category: {category}
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                Condition: {condition}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
