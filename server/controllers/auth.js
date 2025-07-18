const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const Tempmail = require("../models/tempemail");
const User = require("../models/user");
const uploadToCloudinary = require("../utils/uploadHelper");

const register = async (req, res) => {
  try {
    // console.log("req files is ", req.files);
    const { userName, email, password, phoneNumber, gender } = req.body;

    const uploadResults = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );
    const images = uploadResults.map(({ secure_url, public_id }) => ({
      url: secure_url,
      public_id,
    }));
    const profilePicture = images[0];
    // console.log("pp", profilePhoto);

    // 1. Validate required fields
    if (!userName || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "All fields are required",
      });
    }
    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        msg: "User already exists with this email ID",
      });
    }

    // 3. Check if email was verified
    const tempRecord = await Tempmail.findOne({ email });
    if (!tempRecord || !tempRecord.verified) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Email is not verified. Please verify your email before registering.",
      });
    }

    // 4. Register the new user
    const newUser = new User({
      userName,
      email,
      password,
      phoneNumber,
      gender,
      profilePicture,
    });
    // console.log("new user to save is", newUser);
    await newUser.save();

    // 5. Remove the temp email record (optional cleanup)
    await Tempmail.deleteOne({ email });

    // 6. Generate JWT token
    const token = newUser.createJWT();

    // 7. Respond with success
    console.log(email, password, "register success");
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

    // Extract Mongoose validation error message
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: errors.join(". "),
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Registration failed",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email,password,"trying to login");

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: "User not found with this email",
      });
    }

    const isMatch = await user.verifyPassword(password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Invalid password",
      });
    }

    const token = user.createJWT();

    const isLocalhost =
      req.hostname === "localhost" || req.hostname === "127.0.0.1";

    res.cookie("token", token, {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "Lax" : "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: "Login successful",
      user: {
        userId: user._id,
        userName: user.userName,
        isAdmin: user.isAdmin,
        profilePicture: user.profilePicture.url,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something went wrong on the server",
    });
  }
};



const logout = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    msg: "Logged out successfully!",
  });
};



module.exports = { register, login, logout,};
