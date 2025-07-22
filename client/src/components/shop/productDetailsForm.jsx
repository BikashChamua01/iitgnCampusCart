// src/components/ProductDetailsForm.jsx
import React from "react";

const ProductDetailsForm = ({ form, setForm }) => {
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const categories = [
    "Books",
    "Electronics",
    "Clothing",
    "Furniture",
    "Cycle",
    "Stationery",
    "Others",
  ];

  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  return (
    <div className="flex flex-col gap-2">
      {/* Title */}
      <label className="block">
        <span className="text-[#2b2b2b] font-medium">Title</span>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
          placeholder="Enter product title"
          required
        />
      </label>

      {/* Description */}
      <label className="block">
        <span className="text-[#2b2b2b] font-medium">Description</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full mt-1 px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad] resize-none"
          placeholder="Enter detailed description"
          required
        ></textarea>
      </label>

      {/* prices */}
      <div className="md:flex gap-1 ">
        {/* Price */}
        <label className="block md:w-1/2">
          <span className="text-[#2b2b2b] font-medium ">Selling Price (₹)</span>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
            placeholder="Final price"
            required
            min={0}
          />
        </label>

        {/* Original Price (optional) */}
        <label className="block md:w-1/2">
          <span className="text-[#2b2b2b] font-medium">Original Price (₹)</span>
          <input
            type="number"
            name="originalPrice"
            value={form.originalPrice}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-[#7635b6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
            placeholder="original cost"
            min={0}
          />
        </label>
      </div>
      {/* CATEGORY AND CONDITION */}
      <div className="md:flex gap-1 ">
        {/* Category */}
        <label className="block md:w-1/2">
          <span className="text-[#2b2b2b] font-medium">Category</span>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full mt-1 px-4 py-2 border border-[#7635b6] rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        {/* Condition */}
        <label className="block md:w-1/2">
          <span className="text-[#2b2b2b] font-medium">Condition</span>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-[#7635b6] rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6a0dad]"
          >
            {conditions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default ProductDetailsForm;
