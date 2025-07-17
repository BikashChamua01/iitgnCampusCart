const router = require("express").Router();
const { checkAuth, checkAdmin } = require("../middleware/authorization");
const {
  fetchAllUsers,
  deleteUserAccount,
} = require("../controllers/users-controller");

router.get("/fetch-users", checkAuth, checkAdmin, fetchAllUsers);
router.post("/delete-account/:id",checkAuth, deleteUserAccount);

module.exports = router;
