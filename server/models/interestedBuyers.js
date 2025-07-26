const mongoose = require("mongoose");

const interestedBuyerSchema = mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        buyers: [
          {
            buyerId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            buyerMessage: {
              type: String,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterestedBuyers", interestedBuyerSchema);
