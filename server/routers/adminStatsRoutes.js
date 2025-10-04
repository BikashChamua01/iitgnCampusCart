const express = require("express");
const router = express.Router();
const {
  getProductsPerCategory,
  getProductsPerCondition,
  getProductsLast4Months,
  getProductsSoldLast3Months,
  getUserStatistics,
} = require("../controllers/adminStatsController");

const { checkAuth, checkAdmin } = require("../middleware/authorization");

// Dashboard stats endpoints
router.get("/products/category", checkAuth, checkAdmin, getProductsPerCategory);
router.get(
  "/products/condition",
  checkAuth,
  checkAdmin,
  getProductsPerCondition
);
router.get(
  "/products/last4months",
  checkAuth,
  checkAdmin,
  getProductsLast4Months
);
router.get(
  "/products/sold3months",
  checkAuth,
  checkAdmin,
  getProductsSoldLast3Months
);
router.get("/users/statistics", checkAuth, checkAdmin, getUserStatistics);

module.exports = router;
