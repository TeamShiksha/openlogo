const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/fileUpload");
const addAdminController = require("../controllers/admin/add");
const getImagesController = require("../controllers/admin/data");
const adminUploadController = require("../controllers/admin/upload");
const adminReUploadController = require("../controllers/admin/reupload");

router.put(
  "/promote", 
  authMiddleware({ adminOnly: true }), 
  addAdminController
);

router.get(
  "/images", 
  authMiddleware({ adminOnly: true }), 
  getImagesController
);

router.post(
  "/image",
  authMiddleware({adminOnly: true}),
  upload.single("logo"),
  adminUploadController
);

router.put(
  "/image",
  authMiddleware({ adminOnly: true }),
  upload.single("logo"),
  adminReUploadController
);

module.exports = router;