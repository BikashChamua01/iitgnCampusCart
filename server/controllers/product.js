// controllers/product.js
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const uploadToCloudinary = require("../utils/uploadHelper");
const mongoose = require("mongoose");
const User = require("../models/user");

const createProduct = async (req, res) => {
  try {
    console.log(req.body, "In the server side ,create product");
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
      originalPrice: Number(originalPrice),
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
    const product = await Product.findById(id);
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
  try {
    const { id } = req.params;
    // Check if product exists
    const product = await Product.findById(id);
    console.log("hello");
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "Product not found",
      });
    }
    //If the current person is the selller or the admin then only he can do it
    if (product.seller != req.user.userId && !req.user.isAdmin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "You are Not authorized to delete this product",
      });
    }
    // Delete the product
    await Product.findByIdAndDelete(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Failed to delete the product",
    });
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
    console.log(retainedImages);

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

    // 3️⃣ Authorization: only the user themself or an admin can view
    if (userId !== loggedInId && !isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        msg: "You are not authorized to view this user's listings",
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

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  editProduct,
  myListings,
};
