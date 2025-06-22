const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String }, // for Cloudinary or similar
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      required: false, // Optional: not all sellers may remember it
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Books",
        "Electronics",
        "Clothing",
        "Furniture",
        "Cycle",
        "Stationery",
        "Others",
      ],
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
      default: "Good",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
