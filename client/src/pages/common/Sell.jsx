// src/pages/Sell.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ImageUploader from "../../components/shop/ImageUploader";
import ProductDetailsForm from "../../components/shop/productDetailsForm";
import ExistingImages from "../../components/shop/ExistingImages";
import { useLocation, useNavigate } from "react-router-dom";
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
  // Get the product details for edit mode
  const getProductDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/${productId}`
      );
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
    // eslint-disable-next-line
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
      toast.error(error?.response?.data?.msg || "Error in deleting the image ");
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (existingImages.length + images.length > 5)
      return toast.error("Max 5 images are allowed");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("originalPrice", form.originalPrice);
      formData.append("category", form.category);
      formData.append("condition", form.condition);
      formData.append("existingImages", JSON.stringify(existingImages));
      images.forEach((img) => formData.append("images", img));

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/edit/${productId}`,
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
        navigate("/shop/listings");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.msg ||
          error.message ||
          error.msg ||
          "Error Occured in modifying the product"
      );
    } finally {
      setLoading(false);
    }
  };

  // *********UPLOAD MODE***********
  const handleUpload = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.price ||
      !form.category ||
      !form.condition
    ) {
      return toast.info("Please fill in all required fields.");
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

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/createProduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

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
      toast.error(err?.response?.data?.msg || "Failed to upload product");
    } finally {
      setLoading(false);
      navigate("/shop/listings");
    }
  };

  return (
    <div className="h-auto bg-white py-8  px-2 md:px-4 ">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-5 tracking-tight text-violet-800 drop-shadow-sm">
          {mode === "edit" ? "Edit Product" : "Add New Product"}
        </h1>

        <form
          onSubmit={mode === "edit" ? handleEditSubmit : handleUpload}
          className="flex flex-col md:flex-row gap-2   rounded-3xl overflow-hidden md:p-8"
        >
          {/* Left Panel: Image Upload */}
          <section className="flex-1 p-6 flex flex-col gap-4 justify-between bg-gradient-to-br  align-middle ">
            <div>
              {mode === "edit" && existingImages?.length > 0 && (
                <ExistingImages
                  images={existingImages}
                  handleImageDelete={handleImageDelete}
                />
              )}
            </div>
            <ImageUploader images={images} setImages={setImages} />
            <div className="text-xs text-violet-400 mt-1 text-center select-none ">
              {images.length + existingImages?.length}/5 images selected
            </div>
          </section>

          {/* Right Panel: Product Details */}
          <section className="flex-1 p-6 flex flex-col justify-between bg-white pt-0">
            <ProductDetailsForm form={form} setForm={setForm} />
            <button
              type="submit"
              disabled={loading}
              className="mt-8 bg-gradient-to-br from-violet-600 to-violet-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition
                duration-300
                disabled:opacity-70
                ring-2 ring-violet-200
                hover:from-white hover:to-violet-50 hover:text-violet-700 hover:ring-violet-400 hover:border-violet-500 hover:border
                cursor-pointer
                focus:outline-none focus:ring-4 focus:ring-violet-200"
              onClick={(event) => {
                mode === "upload"
                  ? handleUpload(event)
                  : handleEditSubmit(event);
              }}
            >
              {loading
                ? mode === "upload"
                  ? "Uploading..."
                  : "Updating..."
                : mode === "upload"
                ? "Upload Product"
                : "Save Changes"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Sell;
