// src/pages/Sell.jsx

import React, { useState } from "react";
import axios from "axios";
import ImageUploader from "../../components/shop/ImageUploader";
import ProductDetailsForm from "../../components/shop/productDetailsForm";

const Sell = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    condition: "Good",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.price ||
      !form.category ||
      !form.condition
    ) {
      return alert("Please fill in all required fields.");
    }

    if (images.length === 0) return alert("Please upload at least one image.");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      if (form.originalPrice) {
        formData.append("originalPrice", form.originalPrice);
      }
      formData.append("category", form.category);
      formData.append("condition", form.condition);
      images.forEach((img) => formData.append("images", img));


      await axios.post("/api/v1/products/createProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials : true
      });

      alert("✅ Product added successfully!");
      setForm({
        title: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        condition: "Good",
      });
      setImages([]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to upload product.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-cream-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#6a0dad] mb-8">
          Add New Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8"
        >
          {/* Left Panel: Image Upload */}
          <div className="flex-1">
            <ImageUploader images={images} setImages={setImages} />
          </div>

          {/* Right Panel: Product Details */}
          <div className="flex-1 flex flex-col justify-between">
            <ProductDetailsForm form={form} setForm={setForm} />
            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-[#6a0dad] text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-60 border-2 border-transparent hover:bg-white hover:text-[#6a0dad] hover:border-[#b27dd8]"
              onClick={(event)=>{
                handleSubmit(event);
              }}

            >
              {loading ? "Uploading..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sell;
