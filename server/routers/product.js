const router = require("express").Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  editProduct,
  myListings,
} = require("../controllers/product");

const { checkAuth, checkAuthAndAdmin } = require("../middleware/authorization");

router.get("/", getAllProducts);
router.post(
  "/createProduct",
  checkAuth,
  upload.array("images", 5),
  createProduct
);
router.delete("/delete/:id", checkAuth, deleteProduct);
router.patch("/edit/:id", checkAuth, upload.array("images", 5), editProduct);
router.get("/:id", getSingleProduct);
router.get("/my-listings/:userId", checkAuth, myListings);

module.exports = router;
