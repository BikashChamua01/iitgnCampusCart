const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { register, login, editProfile, logout, userProfile} = require("../controllers/auth");
const {
  sendVerificationCode,
  verifyCode,
} = require("../controllers/emailcontroller");

const { checkAuth } = require("../middleware/authorization");

router.post("/send-code", sendVerificationCode);
router.post("/verify-code", verifyCode);
router.post("/login", login);
router.post("/register",upload.array("images",1), register);
router.patch("/editProfile/:id", editProfile);
router.get("/userProfile/:id", userProfile);
router.get("/check-auth", checkAuth, (req, res) => {
  const user = req.user;
  return res.json({
    success: true,
    msg: "Authorized",
    user,
  });
});
router.post("/logout", logout)

module.exports = router;
