const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authentication;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       msg: "Token expires / Invalid Token. Please login again",
//     });
//   }

//   const token = authHeader.split(" ")[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = {
//       userId: payload.userId,
//       userName: payload.userName,
//       isAdmin: payload.isAdmin,
//     };
//     next();
//   } catch (err) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       msg: "Authentication Failed",
//       err: err,
//     });
//   }
// };

// // It is used to modify an account by the admin or by the user itself
// const verifyTokenAndAuthorization = (req, res, next) => {
//   console.log("Hi");
//   console.log(req.params.id);
//   verifyToken(req, res, () => {
//     if (req.user.userId === req.params.id || req.user.isAdmin) {
//       next();
//     } else {
//       return res.status(StatusCodes.FORBIDDEN).json({
//         msg: "You are not Admin! Only admin has this access",
//       });
//     }
//   });
// };

// const verifyTokenAndAdmin = (req, res, next) => {
//   verifyToken(req, res, () => {
//     if (req.user.isAdmin) {
//       next();
//     } else {
//       return res
//         .status(StatusCodes.FORBIDDEN)
//         .json("Only admin can perform this action!!!");
//     }
//   });
// };

const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        msg: "Login to get access",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error in verifyToken ", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Unauthenticated user",
    });
  }
};

const checkAuthAndAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      msg: "You are not authorized as admin",
    });
  }
  next();
};

module.exports = {
  checkAuth,
  checkAuthAndAdmin,
};
