const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product");
const User = require("../models/user");
const InterestedBuyers = require("../models/interestedBuyers");
const Wishlist = require("../models/wishlist");
const mongoose = require("mongoose");
const { sendRejectBuyRequest } = require("./emailcontroller");

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
  const session = await mongoose.startSession();
  try {
    const { buyerId, productId, sellerId } = req.body;
    const { userId } = req.user;

    // ✅ Ensure only the seller can perform this action
    if (sellerId.toString() !== userId.toString()) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Unauthorized user",
      });
    }

    // ✅ Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Product not found in database",
      });
    }

    // ✅ Product already sold
    if (product.soldOut) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "The product is already sold out",
      });
    }

    // ✅ Validate buyer and seller
    const buyer = await User.findById(buyerId);
    if (!buyer) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "The buyer is not valid",
      });
    }

    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "The seller is not valid",
      });
    }

    // ✅ Check if buyer is in interested list
    const interestedBuyers = await InterestedBuyers.findOne({ productId });
    if (!interestedBuyers) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "No interested buyers found for this product",
      });
    }

    const buyerIndex = interestedBuyers.buyers.findIndex(
      (entry) => entry.buyer.toString() === buyerId.toString()
    );

    if (buyerIndex === -1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "This buyer is not in the interested buyers list",
      });
    }

    // ✅ Begin lightweight transaction
    session.startTransaction();

    // 1️⃣ Remove buyer from interested list
    await InterestedBuyers.updateOne(
      { productId },
      { $pull: { buyers: { buyer: buyerId } } },
      { session }
    );

    // 2️⃣ Remove product from buyer's wishlist
    await Wishlist.updateOne(
      { userId: buyerId },
      { $pull: { interests: productId } },
      { session }
    );

    // 3️⃣ Delete doc if empty
    const updatedDoc = await InterestedBuyers.findOne({ productId }).session(session);
    if (updatedDoc && updatedDoc.buyers.length === 0) {
      await InterestedBuyers.deleteOne({ productId }, { session });
    }

    await session.commitTransaction();

    // ✅ Send notification
    try {
      await sendRejectBuyRequest({ buyer, seller, product });
    } catch (notifErr) {
      console.warn("Notification sending failed:", notifErr.message);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Buyer successfully removed from interested list and wishlist",
    });

  } catch (error) {
    console.error("[RejectBuyRequest Error]:", error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: error.message || "Server encountered an error while rejecting buyer request",
    });
  } finally {
    session.endSession();
  }
};





module.exports = { markInterested, getBuyRequests, rejectBuyRequest };
