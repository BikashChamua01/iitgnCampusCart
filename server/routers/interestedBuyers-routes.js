const router = require("express").Router();

// get the controllers
const {
  markInterested,
} = require("../controllers/interestedBuyers-controller");

// get the middlewares
const { checkAuth } = require("../middleware/authorization");

router.post("/mark-interested", checkAuth, markInterested);

module.exports = router;
