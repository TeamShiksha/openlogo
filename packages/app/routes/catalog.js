const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/fileUpload");
const {
  addPermissionController,
  getCatalogController,
  updateCatalogController,
  addCatalogController,
  getAnalyticsController,
} = require("../controllers/catalog");
const { UserType } = require("../utils/constants");

router.put(
  "/permission/:userId/roles/:role",
  authMiddleware({ adminOnly: true }),
  addPermissionController
);

router.get(
  "/stats",
  authMiddleware({ adminOnly: true }),
  getAnalyticsController
);

router.get("/logos", authMiddleware({ adminOnly: true }), getCatalogController);
router.post(
  "/logo",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }), // To allow the admin, oprator to upload the image
  upload.single("logo"),
  addCatalogController
);
router.put(
  "/logo",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  upload.single("logo"),
  updateCatalogController
);

module.exports = router;
