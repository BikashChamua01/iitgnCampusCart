const express = require("express");
const router = express.Router();

const { register, login, editProfile } = require("../controllers/auth");
const {
  sendVerificationCode,
  verifyCode,
} = require("../controllers/emailcontroller");

router.post("/send-code", sendVerificationCode);
router.post("/verify-code", verifyCode);
router.post("/login", login);
router.post("/register", register);
router.patch("/editProfile/:id", editProfile);

module.exports = router;
