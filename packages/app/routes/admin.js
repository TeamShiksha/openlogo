const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/fileUpload");
const addAdminController = require("../controllers/admin/add");
const getImagesController = require("../controllers/admin/data");
const adminUploadController = require("../controllers/admin/upload");
const adminReUploadController = require("../controllers/admin/reupload");

router.put(
  "/add", 
  authMiddleware({ adminOnly: true }), 
  addAdminController
);

router.get(
  "/images", 
  authMiddleware({ adminOnly: true }), 
  getImagesController
);

router.post(
  "/upload",
  authMiddleware({adminOnly: true}),
  upload.single("logo"),
  adminUploadController
);

router.put(
  "/reupload",
  authMiddleware({ adminOnly: true }),
  upload.single("logo"),
  adminReUploadController
);

module.exports = router;