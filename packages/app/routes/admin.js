const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const addAdminController = require("../controllers/admin/add");

router.put(
    "/add", 
    authMiddleware({ adminOnly: true }), 
    addAdminController
  );

module.exports = router;