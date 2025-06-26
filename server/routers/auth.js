const express = require("express");
const router = express.Router();

const { register, login, editProfile } = require("../controllers/auth");
const {
  sendVerificationCode,
  verifyCode,
} = require("../controllers/emailcontroller");

const { checkAuth } = require("../middleware/authorization");

router.post("/send-code", sendVerificationCode);
router.post("/verify-code", verifyCode);
router.post("/login", login);
router.post("/register", register);
router.patch("/editProfile/:id", editProfile);
router.get("/check-auth", checkAuth, (req, res) => {
  const user = req.user;
  return res.json({
    success: true,
    msg: "Authorized",
    user,
  });
});

module.exports = router;
