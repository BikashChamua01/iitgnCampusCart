const router = require("express").Router();

const {
  addToWishList,
  deleteFromWishList,
  fetchWishList,
  fetchBuyRequests,
} = require("../controllers/wishlist-controller");

const { checkAuth } = require("../middleware/authorization");

router.post("/add/:productId", checkAuth, addToWishList);
router.delete("/delete/:productId", checkAuth, deleteFromWishList);
router.get("/get-wishlist", checkAuth, fetchWishList);
router.get("/get-buy-requests/:userId", checkAuth, fetchBuyRequests);

module.exports = router;
