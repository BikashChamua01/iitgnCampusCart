const router = require("express").Router();

const {
  addToWishList,
  deleteFromWishList,
  fetchWishList,
} = require("../controllers/wishlist-controller");

const { checkAuth } = require("../middleware/authorization");

router.post("/add/:productId", checkAuth, addToWishList);
router.delete("/delete/:productId", checkAuth, deleteFromWishList);
router.get("/get-wishlist", checkAuth, fetchWishList);

module.exports = router;
