const router = require("express").Router();
const {
  getLogoController,
  searchLogoController,
  demoSearchLogoController,
  getLogoImageController,
} = require("../controllers/logo");

router.get("/", getLogoController);
router.get("/search", searchLogoController);
router.get("/demo-search", demoSearchLogoController);
router.get("/image", getLogoImageController);

module.exports = router;
