const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Must provide the user name"],
    },

    email: {
      type: String,
      required: [true, "Must provide the email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Must provide the password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 0,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          "Password must contain at least one letter, one number, and one special character",
      },
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // ⏰ Adds createdAt and updatedAt fields
  }
);

userSchema.pre("save", async function (next) {
  // only hash if password was set/modified
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// generate the token
userSchema.methods.createJWT = function () {
  const token = jwt.sign(
    {
      userId: this._id,
      userName: this.userName,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return token;
};

userSchema.methods.verifyPassword = async function (candidatePassword) {
  try {
    if (!candidatePassword || !this.password) {
      return false;
    }

    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    console.error("Password comparison failed:", error);
    return false;
  }
};

module.exports = mongoose.model("USER", userSchema);
