const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product");
const User = require("../models/user");
const InterestedBuyers = require("../models/interestedBuyers");
const Wishlist = require("../models/wishlist");
const mongoose = require("mongoose");

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
    if (product.soldOut)
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        msg: "Already soldout. refresh your browser",
        error: { message: "Already soldout. refresh your browser" },
      });

    // Fetch or create InterestedBuyers document for the seller
    let interestedBuyers = await InterestedBuyers.findOne({ productId });
    if (!interestedBuyers) {
      interestedBuyers = new InterestedBuyers({
        productId,
        buyers: [],
      });
    }

    //check if it is seller
    if (sellerId.toString() === buyerId.toString()) {
      return res.status(StatusCodes.OK).json({
        success: false,
        msg: "You are seller of this Product!",
        data: interestedBuyers,
      });
    }

    const buyerIndex = interestedBuyers.buyers.findIndex(
      (buyer) => buyer.buyer.toString() === buyerId.toString()
    );

    if (buyerIndex !== -1) {
      return res.status(StatusCodes.OK).json({
        success: false,
        msg: "Product already marked as interested",
        data: interestedBuyers,
      });
    }

    interestedBuyers.buyers.push({ buyer: buyerId, buyerMessage });

    await interestedBuyers.save();

    // also insert the product id in the interests
    let wishlist = await Wishlist.findOne({ userId: buyerId });
    if (!wishlist) {
      // make a new wishlist
      wishlist = new Wishlist({
        userId: buyerId,
        products: [],
        interests: [],
      });
    }

    const productIndexInInterests = wishlist.interests.findIndex(
      (pid) => pid.toString() === productId.toString()
    );

    if (productIndexInInterests === -1) wishlist.interests.push(productId);

    await wishlist.save();

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

// for the seller not the normal user
const getBuyRequests = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;
    const { productId, sellerId } = req.query;

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

    const product_of_interest = await InterestedBuyers.findOne({
      productId,
    }).populate("buyers.buyer", "userName email profilePicture phoneNumber");
    // console.log(product_of_interest, " THE BUY REQUEST ARE **********");

    if (!product_of_interest || product_of_interest?.buyers.length == 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "No interested Users currently",
        buyRequests: [],
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

//reject buy request
const rejectBuyRequest = async (req, res) => {
  console.log("here i am rejecting");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId, buyerId } = req.body;

    if (!productId || !buyerId) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Product ID and Buyer ID are required" });
    }

    // ✅ Check if InterestedBuyers document exists
    const interestedDoc = await InterestedBuyers.findOne({ productId }).session(
      session
    );
    if (!interestedDoc) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ message: "No interested buyers found for this product" });
    }

    // ✅ Check if buyer exists in the list
    const buyerExists = interestedDoc.buyers.some(
      (b) => b.buyer.toString() === buyerId
    );
    if (!buyerExists) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ message: "Buyer not found in interested list" });
    }

    // ✅ Check if Wishlist entry exists and contains this product
    const wishlistDoc = await Wishlist.findOne({ userId: buyerId }).session(
      session
    );
    if (!wishlistDoc) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ message: "Wishlist not found for this buyer" });
    }
    const inWishlist = wishlistDoc.interests.some(
      (p) => p.toString() === productId
    );
    if (!inWishlist) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ message: "Product not found in buyer's wishlist interests" });
    }

    // 1️⃣ Remove buyer from InterestedBuyers list
    await InterestedBuyers.updateOne(
      { productId },
      { $pull: { buyers: { buyer: buyerId } } },
      { session }
    );

    // 2️⃣ Remove product from buyer's Wishlist interests
    await Wishlist.updateOne(
      { userId: buyerId },
      { $pull: { interests: productId } },
      { session }
    );

    // 3️⃣ If no buyers left, delete document
    const updatedDoc = await InterestedBuyers.findOne({ productId }).session(
      session
    );
    if (updatedDoc && updatedDoc.buyers.length === 0) {
      await InterestedBuyers.deleteOne({ productId }, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Buyer successfully removed from interested list and wishlist",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while removing buyer interest",
    });
  }
};

module.exports = { markInterested, getBuyRequests, rejectBuyRequest };
