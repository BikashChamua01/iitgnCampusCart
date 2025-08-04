const router = require("express").Router();

// get the controllers
const {
  markInterested,
  getBuyRequests,
  rejectBuyRequest,
} = require("../controllers/interestedBuyers-controller");

// get the middlewares
const { checkAuth } = require("../middleware/authorization");

router.post("/mark-interested", checkAuth, markInterested);
router.get("/get-buy-requests", checkAuth, getBuyRequests);
router.post("/reject-buy-request", checkAuth, rejectBuyRequest);

module.exports = router;
