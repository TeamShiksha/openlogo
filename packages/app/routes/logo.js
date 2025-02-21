const router = require("express").Router();
const {
  getLogoController,
  searchLogoController,
} = require("../controllers/logo");

router.get("/", getLogoController);
router.get("/search", searchLogoController);

module.exports = router;
