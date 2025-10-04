const Product = require("../models/product");
const User = require("../models/user");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

// Helper to get date N months ago
function monthsAgo(n) {
  const date = new Date();
  date.setMonth(date.getMonth() - n);
  return date;
}

// ================== CONTROLLERS ==================

/** 1️⃣ Products per Category */
exports.getProductsPerCategory = async (req, res) => {
  try {
    const data = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Products per category fetched successfully",
      data,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: err.message || "Failed to fetch products per category",
    });
  }
};

/** 2️⃣ Products per Condition */
exports.getProductsPerCondition = async (req, res) => {
  try {
    const data = await Product.aggregate([
      { $group: { _id: "$condition", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Products per condition fetched successfully",
      data,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: err.message || "Failed to fetch products per condition",
    });
  }
};

/** 3️⃣ Products uploaded in last 4 months */
exports.getProductsLast4Months = async (req, res) => {
  try {
    const fourMonthsAgo = monthsAgo(4);
    const data = await Product.aggregate([
      { $match: { createdAt: { $gte: fourMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formatted = data.map((d) => ({
      month: months[d._id - 1],
      count: d.count,
    }));

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Products uploaded in the last 4 months fetched successfully",
      data: formatted,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: err.message || "Failed to fetch product upload stats",
    });
  }
};

/** 4️⃣ Products sold in last 3 months */
exports.getProductsSoldLast3Months = async (req, res) => {
  try {
    const threeMonthsAgo = monthsAgo(3);
    const data = await Product.aggregate([
      { $match: { soldOut: true, updatedAt: { $gte: threeMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$updatedAt" },
          soldCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formatted = data.map((d) => ({
      month: months[d._id - 1],
      sold: d.soldCount,
    }));

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "Products sold in the last 3 months fetched successfully",
      data: formatted,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: err.message || "Failed to fetch products sold stats",
    });
  }
};

/** 5️⃣ User Statistics */
exports.getUserStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await Product.distinct("seller").then((s) => s.length);
    const activeSellers = await Product.aggregate([
      { $match: { createdAt: { $gte: monthsAgo(1) } } },
      { $group: { _id: "$seller" } },
    ]);

    const stats = {
      totalUsers,
      totalSellers,
      activeSellers: activeSellers.length,
    };

    res.status(StatusCodes.OK).json({
      success: true,
      msg: "User statistics fetched successfully",
      data: stats,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: err.message || "Failed to fetch user statistics",
    });
  }
};
