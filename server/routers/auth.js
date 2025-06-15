const express = require("express");
const router = express.Router();

const { register, login, editProfile } = require("../controllers/auth");

router.post("/login", login);
router.post("/register", register);
router.patch("/editProfile/:id", editProfile);

module.exports = router;
