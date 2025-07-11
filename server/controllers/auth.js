const USER = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const TEMPMAIL = require("../models/tempemail");
const user = require("../models/user");

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    // console.log(email,password,"trying to register");

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
    console.log(email,password,"register success");
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
    // console.log(email,password,"trying to login");

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Email and password are required",
      });
    }

    const user = await USER.findOne({ email }).select("+password");

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

const logout = async(req, res)=>
{
  try{
    const token = user.token;
    const isLocalhost =
      req.hostname === "localhost" || req.hostname === "127.0.0.1";
    res.clearCookie("token",token, {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "Lax" : "None",
    }).json({
      success : true,
      msg : "Log out successfully"
    })

  }catch(error)
  {
    console.log(error)
  }
}
module.exports = { register, login, editProfile,logout };
