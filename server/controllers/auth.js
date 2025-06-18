const USER = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const TEMPMAIL = require("../models/tempemail");
const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // 1. Validate required fields
    if (!userName || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "All fields are required",
      });
    }

    // 2. Check if user already exists
    const existingUser = await USER.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        msg: "User already exists with this email ID",
      });
    }

    // 3. Check if email was verified
    const tempRecord = await TEMPMAIL.findOne({ email });
    if (!tempRecord || !tempRecord.verified) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Email is not verified. Please verify your email before registering.",
      });
    }

    // 4. Register the new user
    const newUser = new USER({ userName, email, password });
    await newUser.save();

    // 5. Remove the temp email record (optional cleanup)
    await TEMPMAIL.deleteOne({ email });

    // 6. Generate JWT token
    const token = newUser.createJWT();

    // 7. Respond with success
    return res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "Registration successful",
      user: {
        userId: newUser._id,
        isAdmin: newUser.isAdmin,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Registration failed",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if both fields are provided
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Email and password are required",
      });
    }

    // 2. Find the user and include the password field
    const user = await USER.findOne({ email }).select("+password");

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "User not found with this email",
      });
    }

    // 3. Verify the password
    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Invalid password",
      });
    }

    // 4. Create the JWT token
    const token = user.createJWT();

    // 5. Send response
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Login successful",
      user: {
        userId: user._id,
        userName: user.userName,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something went wrong on the server",
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
    const user = await USER.findById(id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "User not found" });
    }

    // 4. Apply only provided changes
    if (userName != null) user.userName = userName;
    if (email != null) user.email = email;

    if (password != null) {
      // a) Require current password
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
      // b) Assign new plain‑text password; pre‑save hook will hash it
      user.password = password;
    }

    // 5. Validate & save (runs your pre-save hook)
    await user.validate();
    const updated = await user.save();

    // 6. Optionally issue a fresh JWT
    const token = updated.createJWT();

    // 7. Return safe fields only
    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Profile updated successfully",
      user: {
        id: updated._id,
        userName: updated.userName,
        email: updated.email,
      },
      token,
    });
  } catch (err) {
    console.error("Error in editProfile:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: "Server error. Please try again later." });
  }
};

module.exports = { register, login, editProfile };
