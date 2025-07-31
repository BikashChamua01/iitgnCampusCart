const mongoose = require("mongoose");

const wishListSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  interests: [
    {
      type: mongoose.Schema.Types.ObjectId, //product id
      ref: "Product",
    },
  ],
});

module.exports = mongoose.model("Wishlist", wishListSchema);
