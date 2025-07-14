// src/pages/Sell.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageUploader from "../../components/shop/ImageUploader";
import ProductDetailsForm from "../../components/shop/productDetailsForm";
import ExistingImages from "../../components/shop/ExistingImages";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { toast } from "sonner";

const Sell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const productId = location?.state?.productId;
  const mode = productId ? "edit" : "upload";

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    condition: "Good",
  });

  const clearForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      condition: "Good",
    });
    setExistingImages([]);
  };

  // *********EDIT MODE************
  // Get the product details for the edit mode
  const getProductDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/products/${productId}`);
      if (response.data.success) {
        const {
          title,
          description,
          price,
          originalPrice,
          category,
          condition,
          images,
        } = response.data.product;
        setForm({
          title,
          description,
          price,
          originalPrice,
          category,
          condition,
        });
        setExistingImages(images);
      }
    } catch (error) {
      console.log(error, " to get the product details");
    }
  }, [productId]);

  useEffect(() => {
    clearForm();
    if (mode === "edit") getProductDetails();
  }, [getProductDetails, mode]);

  // delete single image
  const handleImageDelete = async (imageId) => {
    try {
      const newExistingImages = existingImages.filter((image) => {
        return image._id !== imageId;
      });
      setExistingImages(newExistingImages);
    } catch (error) {
      console.log("Error in deleting the image ", error);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    // check some validations
    // Max 5 images
    if (existingImages.length + images.length > 5)
      return toast.error("Max 5 images are allowed");
    setLoading(true);

    try {
      // create the form data
      const formData = new FormData();

      // Append the details in the form data
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("originalPrice", form.originalPrice);
      formData.append("category", form.category);
      formData.append("condition", form.condition);
      // Append the existing images
      formData.append("existingImages", JSON.stringify(existingImages));

      // append the image files
      images.forEach((img) => formData.append("images", img));

      const response = await axios.patch(
        `/api/v1/products/edit/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        clearForm();
        toast.success("Product updated successfully");
        navigate("/shop/listings")
      }
    } catch (error) {
      toast.error(
        "Error Occured in modifying the product",
        error.message || error.msg
      );
    } finally {
      setLoading(false);
    }
  };

  // *********UPLOAD MODE***********
  // on sumit for upload

  const handleUpload = async (e) => {
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

    if (images.length === 0)
      return toast.warning("Please upload at least one image.");

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
        withCredentials: true,
      });

      toast.success("Product added successfully!");
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-cream-100 py-2 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-[#6a0dad] mb-3">
          {mode === "edit" ? "Edit Product" : "Add New Product"}
        </h1>

        <form
          onSubmit={mode === "edit" ? handleEditSubmit : handleUpload}
          className="bg-white shadow-lg rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8"
        >
          {/* Left Panel: Image Upload */}
          <div className="flex-1">
            {mode === "edit" ? (
              <ExistingImages
                images={existingImages}
                handleImageDelete={handleImageDelete}
              />
            ) : (
              ""
            )}
            <ImageUploader images={images} setImages={setImages} />
          </div>

          {/* Right Panel: Product Details */}
          <div className="flex-1 flex flex-col justify-between">
            <ProductDetailsForm form={form} setForm={setForm} />
            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-[#6a0dad] text-white font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-60 border-2 border-transparent hover:bg-white hover:text-[#6a0dad] hover:border-[#b27dd8] cursor-pointer"
              onClick={(event) => {
                mode === "upload"
                  ? handleUpload(event)
                  : handleEditSubmit(event);
              }}
            >
              {loading
                ? "Uploading..."
                : mode === "upload"
                ? "Upload Product"
                : "Edit product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sell;
