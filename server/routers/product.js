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
} = require("../controllers/product");

const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/authorization");

router.get("/", getAllProducts);
router.post(
  "/createProduct",
  verifyToken,
  upload.array("images", 5),
  createProduct
);
router.delete("/:id", verifyToken, deleteProduct);
router.patch("/:id", verifyToken, upload.array("images", 5), editProduct);
router.get("/:id", getSingleProduct);

module.exports = router;
