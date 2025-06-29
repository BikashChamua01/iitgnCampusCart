import React, { useState } from "react";
import ImageUploader from "../components/ImageLoader";
import axios from "axios";

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.description)
      return alert("Please fill all fields");
    if (images.length === 0) return alert("Please upload at least one image");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      images.forEach((image) => formData.append("images", image));

      const token = localStorage.getItem("token"); // Or however you store JWT

      const res = await axios.post(
        "/api/v1/product/createProduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product created successfully");
      setForm({ title: "", description: "", price: "" });
      setImages([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-cream-100 p-4 flex items-center justify-center pb-20 md:pb-0">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6 "
      >
        
        {/* Left: Image Upload */}
        <div className="flex-1">
            <h2 className="text-2xl font-bold text-blue-600 mb-2 block md:hidden">
            Add New Product
          </h2>
          <ImageUploader images={images} setImages={setImages} />
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-blue-600 mb-2 hidden md:block">
            Add New Product
          </h2>

          <label className="block">
            <span className="text-gray-700 font-medium">Title</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Product title"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Description</span>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none"
              placeholder="Product description"
              required
            ></textarea>
          </label>

          <label className="block">
            <span className="text-gray-700 font-medium">Price (₹)</span>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter price"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 "
          >
            {loading ? "Uploading..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
