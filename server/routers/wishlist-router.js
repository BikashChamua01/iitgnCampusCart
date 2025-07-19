const router = require("express").Router();

const {
  addToWishList,
  deleteFromWishList,
  fetchWishList,
} = require("../controllers/wishlist-controller");

const { checkAuth } = require("../middleware/authorization");

router.post("/add/:id", checkAuth, addToWishList);
router.delete("/delete/:id", checkAuth, deleteFromWishList);
router.get("/get-wishlist", checkAuth, fetchWishList);

module.exports = router;
