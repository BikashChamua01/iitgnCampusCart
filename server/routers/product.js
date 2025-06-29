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

const { checkAuth, checkAuthAndAdmin } = require("../middleware/authorization");

router.get("/", getAllProducts);
router.post(
  "/createProduct",
  checkAuth,
  upload.array("images", 5),
  createProduct
);
router.delete("/:id", checkAuth, deleteProduct);
router.patch("/:id", checkAuth, upload.array("images", 5), editProduct);
router.get("/:id", getSingleProduct);

module.exports = router;