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

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Delete User controller");
  } catch (error) {
    console.log(error);
  }
};

const changePassword = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error in change password");
  }
};

module.exports = { fetchAllUsers, deleteUser };
