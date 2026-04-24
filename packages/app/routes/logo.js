const router = require("express").Router();
const {
  getLogoController,
  searchLogoController,
  demoSearchLogoController,
} = require("../controllers/logo");
const { searchLimiter } = require("../middlewares/rateLimiter");

router.get("/", getLogoController);
router.get("/search", searchLogoController);
router.get("/demo-search", searchLimiter, demoSearchLogoController);

module.exports = router;
