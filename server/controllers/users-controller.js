const User = require("../models/user");
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");

const fetchAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(), // for total count
    ]);
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Got the users",
      users,
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Failed to fetch the users",
    });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Check authorization
    if (req.user.userId != id && !req.user.isAdmin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "You are not authorized to delete this user",
      });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: `No user exists with the id ${id}`,
      });
    }

    // Delete all products uploaded by the user
    const deletedProducts = await Product.deleteMany({ seller: id });
    console.log("Deleted products:", deletedProducts);

    // Delete user account
    const deletedUser = await User.findByIdAndDelete(id);
    console.log("Deleted user:", deletedUser);

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "User and all their products deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something went wrong while deleting the user",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error in change password");
  }
};

module.exports = { fetchAllUsers, deleteUserAccount };
