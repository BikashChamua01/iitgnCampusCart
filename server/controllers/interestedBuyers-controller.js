const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product");
const User = require("../models/user");
const InterestedBuyers = require("../models/interestedBuyers");
const { request } = require("express");

const markInterested = async (req, res) => {
  try {
    const { userId: buyerId } = req.user;
    const { productId, buyerMessage } = req.body;

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "This product does not exist",
      });
    }

    const sellerId = product.seller;

    // Fetch or create InterestedBuyers document for the seller
    let interestedBuyers = await InterestedBuyers.findOne({ sellerId });
    if (!interestedBuyers) {
      interestedBuyers = new InterestedBuyers({
        sellerId,
        products: [],
      });
    }

    // Check if product is already tracked in this document
    const productIndex = interestedBuyers.products.findIndex((p) =>
      p.productId.equals(productId)
    );

    if (productIndex === -1) {
      // First time product interest — add product and buyer
      interestedBuyers.products.push({
        productId,
        buyers: [{ buyerId, buyerMessage }],
      });
    } else {
      // Product already exists, check if buyer is already marked
      const existingBuyers = interestedBuyers.products[productIndex].buyers;

      const buyerIndex = existingBuyers.findIndex(
        (buyer) => buyer.buyerId.toString() === buyerId.toString()
      );

      if (buyerIndex !== -1) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          msg: "Already marked interested",
        });
      }

      // Add new buyer to the existing product
      existingBuyers.push({ buyerId, buyerMessage });
    }

    await interestedBuyers.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Message sent to seller. They will get back to you soon.",
      data: interestedBuyers,
    });
  } catch (error) {
    console.error("Error in markInterested:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Failed to mark interest in product",
    });
  }
};

const getBuyRequests = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { productId, sellerId } = req.body;
    if (userId.toString() != sellerId.toString() && !isAdmin)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "You are not authorized to access this ",
      });

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "This product doesn't exists",
      });
    }

    const requests = await InterestedBuyers.findOne({ sellerId });
    //     Now find that particular product in the requests
    const productIndex = requests.products.findIndex(
      (product) => product.productId.toString() === productId.toString()
    );

    if (productIndex === -1 || requests.products.length === 0)
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "No users has shown interested for this product",
        buyRequests: [],
      });

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: `${requests.products[productIndex].buyers.length} user(s) have shown interest to your product`,
      buyRequests: [...requests.products[productIndex].buyers],
    });
  } catch (error) {
    console.error("Error in markInterested:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Failed to get the buy requests",
    });
  }
};

module.exports = { markInterested, getBuyRequests };
