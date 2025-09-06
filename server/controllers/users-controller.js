const User = require("../models/user");
const Product = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const Tempmail = require("../models/tempemail");
// const bcrypt = require("bcryptjs");

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
    const { id } = req.params;
    const { password: newPassword, oldPassword } = req.body;

    // Log inputs
    console.log("Change Password Request Body:", req.body);

    // 1. Check if user ID is provided
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "User ID is required in the URL",
      });
    }

    // 2. Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Invalid User ID format",
      });
    }

    // 3. Fetch user and include password field
    const user = await User.findById(id).select("+password");
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "User not found",
      });
    }

    // 4. Ensure old password is provided
    if (!oldPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Current password is required to change password",
      });
    }

    // 5. Validate old password
    const isMatch = await user.verifyPassword(oldPassword);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Invalid current  password",
      });
    }

    // 6. Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "New password must be at least 6 characters long",
      });
    }

    // 7. Update and save new password
    user.password = newPassword;
    await user.validate();
    const updatedUser = await user.save();

    // 8. Generate new token
    const token = updatedUser.createJWT();

    // 9. Set JWT cookie
    const isLocalhost =
      req.hostname === "localhost" || req.hostname === "127.0.0.1";
    res.cookie("token", token, {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "Lax" : "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 10. Respond to client
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Password updated successfully!",
      user: {
        id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    console.error("Error in changePassword:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Server error. Please try again later.",
    });
  }
};

const userProfile = async (req, res) => {
  try {
    console.log("profile access");
    const { id } = req.params;
    console.log(id);
    const user = await User.findById(id);

    if (!user) {
      console.log("no profile found");
      return res.status(StatusCodes.NOT_FOUND).json({
        succcess: false,
        msg: "User not found",
      });
    }
    console.log("checking profile of ", user);
    return res.status(StatusCodes.OK).json({
      succcess: true,
      msg: "User found",
      user,
    });
  } catch (error) {
    console.log("error checking profile of ");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "failed to get the user",
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("body to edit here:", req.body);
    const { userName, email, password, oldPassword, gender, phoneNumber } =
      req.body;

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
    if (phoneNumber != null) user.phoneNumber = phoneNumber;
    if (gender != null) user.gender = gender;
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
    const isLocalhost =
      req.hostname === "localhost" || req.hostname === "127.0.0.1";
    res.cookie("token", token, {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "Lax" : "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

module.exports = {
  fetchAllUsers,
  deleteUserAccount,
  editProfile,
  userProfile,
  changePassword,
};
