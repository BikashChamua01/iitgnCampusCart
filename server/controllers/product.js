// controllers/product.js
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const uploadToCloudinary = require("../utils/uploadHelper");
const mongoose = require("mongoose");
const User = require("../models/user");
const InterestedBuyers = require("../models/interestedBuyers");
const Wishlist = require("../models/wishlist");
const ProductHistory = require("../models/productHistory");
const { sendOrderConfirmation } = require("./emailcontroller");

const createProduct = async (req, res) => {
  try {
    // console.log(req.body, "In the server side ,create product");
    const {
      title,
      description,
      price,
      originalPrice,
      category,
      condition,
      location,
    } = req.body;
    const seller = req.user.userId;

    if (!req.files || req.files.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "At least one image is required." });
    }
    const uploadResults = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );
    const images = uploadResults.map(({ secure_url, public_id }) => ({
      url: secure_url,
      public_id,
    }));

    const product = new Product({
      title,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(0),
      category,
      condition,
      location,
      seller,
      images,
    });

    await product.save();
    return res.status(StatusCodes.CREATED).json({ success: true, product });
  } catch (err) {
    console.error("Create Product Error:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("seller", "userName email"); // optional

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Successfully fetched all the products",
      products,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Failed to get the Products",
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate(
      "seller",
      "userName email profilePicture phoneNumber"
    );
    // console.log(product);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Product not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Product found",
      product,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "failed to get the product",
    });
  }
};

const deleteProduct = async (req, res) => {
  const session = await Product.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;

    // Step 1: Check if product exists
    const product = await Product.findById(id).session(session);
    if (!product) {
      await session.abortTransaction();
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Product not found",
      });
    }

    // Step 2: Authorization check
    if (product.seller.toString() !== req.user.userId && !req.user.isAdmin) {
      await session.abortTransaction();
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "You are not authorized to delete this product",
      });
    }

    // Step 3: Save the product to ProductHistory
    const plainProduct = product.toObject();
    delete plainProduct._id;
    const productHistory = new ProductHistory(plainProduct);
    await productHistory.save({ session });

    // Step 4: Delete product
    await Product.findByIdAndDelete(id).session(session);

    // Step 5: Remove from Wishlist
    await Wishlist.updateMany(
      { products: id },
      { $pull: { products: id } }
    ).session(session);

    await Wishlist.updateMany(
      { interests: id },
      { $pull: { interests: id } }
    ).session(session);

    // Step 6: Remove from InterestedBuyers
    await InterestedBuyers.findOneAndDelete({ productId: id }).session(session);

    // Step 7: Commit
    await session.commitTransaction();
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Product and related references deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Delete Product Error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Failed to delete the product",
    });
  } finally {
    session.endSession();
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      originalPrice,
      category,
      condition,
      existingImages = [], // array of image URLs to retain
    } = req.body;

    const findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Product not found",
      });
    }

    // console.log("after product found");

    if (findProduct.seller != req.user.userId && !req.user.isAdmin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "You are Not authorized to edit this product",
      });
    }

    // console.log("User validation");

    // Step 1: Validate total image count
    const retainedImages = JSON.parse(existingImages);
    // console.log(retainedImages);

    const newFiles = req.files || [];
    const totalImagesCount = retainedImages.length + newFiles.length;

    if (totalImagesCount > 5) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "You can only have a maximum of 5 images per product.",
      });
    }

    // Step 2: Upload new images to Cloudinary
    // const uploadedImageUrls = [];
    // for (const file of newFiles) {
    //   const uploaded = await uploadToCloudinary(file.buffer);
    //   uploadedImageUrls.push(uploaded.secure_url);
    // }

    const uploadResults = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );
    const uploadedImageUrls = uploadResults.map(
      ({ secure_url, public_id }) => ({
        url: secure_url,
        public_id,
      })
    );

    // Step 3: Update fields
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.price = price || findProduct.price;
    findProduct.originalPrice = originalPrice || findProduct.originalPrice;
    findProduct.category = category || findProduct.category;
    findProduct.condition = condition || findProduct.condition;
    findProduct.images = [...retainedImages, ...uploadedImageUrls];

    await findProduct.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Product updated successfully",
      product: findProduct,
    });
  } catch (error) {
    console.error("Error editing product:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Server error in editing the product",
    });
  }
};

const myListings = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInId = req.user.userId;
    const isAdmin = req.user.isAdmin;

    // 3️⃣ Authorization: only the user themself or an admin can view
    if (userId !== loggedInId && !isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "You are not authorized to view this user's listings",
      });
    }

    // 1️⃣ Validate userId param
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Invalid or missing userId parameter",
      });
    }

    // 2️⃣ Check target user exists
    const targetUser = await User.findById(userId).select("userName email");
    if (!targetUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: `No user found with ID ${userId}`,
      });
    }

    // 4️⃣ Fetch their products (sorted newest first)
    const products = await Product.find({ seller: userId })
      .sort({ createdAt: -1 })
      .populate("seller", "userName email");

    // 5️⃣ Handle empty result set
    if (!products.length) {
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: `No products found for user ${targetUser.userName}`,
        products: [],
      });
    }

    // 6️⃣ Success
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: `Fetched ${products.length} products for user ${targetUser.userName}`,
      products,
    });
  } catch (error) {
    console.error("Error in myListings:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Server encountered an error while fetching listings",
    });
  }
};

const soldOut = async (req, res) => {
  try {
    const { buyerId, productId, sellerId } = req.body;
    const { userId } = req.user;
    // the user must be the seller to do this
    if (sellerId.toString() !== userId.toString())
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Unauthorized user",
      });

    // The product must exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "the product is not found in the product database",
      });
    }

    // product already sold out
    if(product.soldOut){
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "the product is Already Sold out",
      });

    }

    // Verify if the buyer id is in the interested database of the product
    const interestedBuyers = await InterestedBuyers.findOne({ productId });
    const indexOfBuyer = interestedBuyers?.buyers?.findIndex(
      (buyer) => buyer.buyer.toString() === buyerId.toString()
    );

    if (indexOfBuyer === -1)
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "This buyer is not in the interested buyers of this product",
      });

    // check the buyer
    const buyer = await User.findById(buyerId);
    if (!buyer)
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "The buyer is not valid",
        success: false,
      });

    // check the seller
    const seller = await User.findById(sellerId);
    if (!seller)
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "The seller is not valid",
        success: false,
      });
    
    // Now its time to sell
    product.soldOut = true;
    product.buyer = { email: buyer.email, userName: buyer.userName };

    // it will persists in the interested products of the

    await product.save();

    // Send confirmation mail to the buyer
    await sendOrderConfirmation({ buyer, seller, product });
    console.log(product);
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Successfully sold out",
    });
  } catch (error) {
    console.error("Error in myListings:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Server encountered an error while connfirming the sell",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  editProduct,
  myListings,
  soldOut,
};
