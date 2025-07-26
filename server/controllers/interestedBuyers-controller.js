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
    let interestedBuyers = await InterestedBuyers.findOne({ productId });
    if (!interestedBuyers) {
      interestedBuyers = new InterestedBuyers({
        productId,
        buyers: [],
      });
    }

    const buyerIndex = interestedBuyers.buyers.findIndex(
      (buyer) => buyer.buyerId === buyerId
    );

    if (buyerIndex !== -1) {
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "Product already marked as interested",
        data: interestedBuyers,
      });
    }

    interestedBuyers.buyers.push({ buyerId, buyerMessage });

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

    // Check for the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "This product doesn't exists",
      });
    }

    const product_of_interest = await InterestedBuyers.findOne({ productId });

    if (!product_of_interest || product_of_interest?.buyers.length == 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "No interested Users currently",
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: `${product_of_interest.buyers.length} user(s) have shown interest to your product`,
      buyRequests: [...product_of_interest.buyers],
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
