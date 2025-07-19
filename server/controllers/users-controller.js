const User = require("../models/user");
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const Tempmail = require("../models/tempemail");

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

    // Delete user account
    const deletedUser = await User.findByIdAndDelete(id);

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

const userProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        succcess: false,
        msg: "User not found",
      });
    }
    // console.log(user);
    return res.status(StatusCodes.OK).json({
      succcess: true,
      msg: "User found",
      user,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "failed to get the user",
    });
  }
};
const editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, email, password, oldPassword } = req.body;

    // 1. ID must be present
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "User ID is required in the URL" });
    }

    // 2. Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "Invalid User ID format" });
    }

    // 3. Fetch existing user document
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "User not found" });
    }

    // 4. Apply only provided changes
    if (userName != null) user.userName = userName;
    if (email != null) user.email = email;

    // 5. If password change is requested
    if (password != null) {
      if (!oldPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          msg: "Current password is required to change password",
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ success: false, msg: "Current password is incorrect" });
      }

      user.password = password; // Will be hashed by pre-save hook
    }

    // 6. Validate and save user
    await user.validate();
    const updated = await user.save();

    // 7. Create new JWT
    const token = updated.createJWT();

    // 8. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "None", // "Lax" if frontend/backend same origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 9. Send updated user response
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Profile updated successfully",
      user: {
        id: updated._id,
        userName: updated.userName,
        email: updated.email,
      },
    });
  } catch (err) {
    console.error("Error in editProfile:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Server error. Please try again later." });
  }
};

module.exports = { fetchAllUsers, deleteUserAccount, editProfile, userProfile };
