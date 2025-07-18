const router = require("express").Router();
const { checkAuth, checkAdmin } = require("../middleware/authorization");
const {
  fetchAllUsers,
  deleteUserAccount,
  editProfile, 
  userProfile,
} = require("../controllers/users-controller");

router.get("/fetch-users", checkAuth, checkAdmin, fetchAllUsers);
router.post("/delete-account/:id",checkAuth, deleteUserAccount);
router.patch("/editProfile/:id", editProfile);
router.get("/userProfile/:id", userProfile);

module.exports = router;
