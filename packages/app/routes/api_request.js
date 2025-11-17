const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const { getApiStatsController } = require("../controllers/api_request");

router.get("/stats", authMiddleware(), getApiStatsController);

module.exports = router;
