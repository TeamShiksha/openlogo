const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/fileUpload");
const {
  addPermissionController,
  getCatalogController,
  updateCatalogController,
  addCatalogController,
} = require("../controllers/catalog");

router.put(
  "/permission/:userId/roles/:role",
  authMiddleware({ adminOnly: true }),
  addPermissionController
);
router.get("/logos", authMiddleware({ adminOnly: true }), getCatalogController);
router.post(
  "/logo",
  authMiddleware({ adminOnly: true }),
  upload.single("logo"),
  addCatalogController
);
router.put(
  "/logo",
  authMiddleware({ adminOnly: true }),
  upload.single("logo"),
  updateCatalogController
);

module.exports = router;
