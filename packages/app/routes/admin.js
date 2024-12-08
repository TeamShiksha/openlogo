const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const addAdminController = require("../controllers/admin/add");
const getImagesController = require("../controllers/admin/data");

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

module.exports = router;