const router = require("express").Router();
const revertToCustomerController = require("../controllers/operator/revert");

router.put(
    "/revert",
    /* authMiddleware({ operatorOnly: true }),*/
    revertToCustomerController
  );
  
  module.exports = router;