const router = require("express").Router();
const { checkAuth, checkAdmin } = require("../middleware/authorization");
const { fetchAllUsers } = require("../controllers/users-controller");

router.get("/fetch-users", checkAuth, checkAdmin, fetchAllUsers);

module.exports = router;
