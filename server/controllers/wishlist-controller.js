const User = require("../models/user");
const Product = require("../models/product");
const Wishlist = require("../models/wishlist");
const { StatusCodes } = require("http-status-codes");

const addToWishList = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "User not found",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Product not found",
      });
    }

    // Try to find user's wishlist
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // If wishlist doesn't exist, create a new one
      wishlist = new Wishlist({
        userId,
        products: [productId],
      });
      await wishlist.save();
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "Wishlist created and product added",
      });
    }

    // Check if product is already in wishlist
    const alreadyWishlisted = wishlist.products.includes(productId);

    if (alreadyWishlisted) {
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "Product already in wishlist",
      });
    }

    // Add product to existing wishlist
    wishlist.products.push(productId);
    await wishlist.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Product added to wishlist",
    });
  } catch (error) {
    console.error("Error in addToWishList:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Server error while adding to wishlist",
    });
  }
};

const deleteFromWishList = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "You don't have any wishlist",
      });
    }

    // Find product in wishlist
    const index = wishlist.products.findIndex(
      (pid) => pid.toString() === productId
    );

    if (index === -1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Product not found in wishlist",
      });
    }

    // Remove product from array
    wishlist.products.splice(index, 1);
    await wishlist.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Product successfully removed from wishlist",
    });
  } catch (error) {
    console.log("Error in deleteFromWishList:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Server error while removing product from wishlist",
    });
  }
};

const fetchWishList = async (req, res) => {
  try {
    const { userId } = req.user;
    const wishlist = await Wishlist.findOne({ userId }).populate("products");

    if (!wishlist || wishlist.products.length === 0)
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "Your wish List is empty",
        wishlistProducts: [],
      });

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Successfully fetched the wishlisted products",
      wishlistProducts: wishlist.products,
    });
  } catch (error) {
    console.log("Error in the fetchWishList", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Server error while fetching the wishlisted products",
    });
  }
};

// for the user not the seller
const fetchBuyRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist)
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Failed to get the wishlist",
        success: false,
      });

    const buyRequests = wishlist.interests;
    if (!buyRequests || buyRequests.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "You have not given any requests",
        success: true,
      });
    }

    return res.status(StatusCodes.OK).json({
      msg: `You have requested for ${buyRequests.length} products`,
      success: true,
      buyRequests,
    });
  } catch (error) {
    console.lg(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Failed to get the buy requests",
    });
  }
};

module.exports = {
  addToWishList,
  deleteFromWishList,
  fetchWishList,
  fetchBuyRequests,
};
