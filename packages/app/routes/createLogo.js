const { getPreSignedController } = require("../controllers/catalog");
const { addCreateLogoController } = require("../controllers/createLogo");
const authMiddleware = require("../middlewares/auth");
const router = require("express").Router();
const { UserType } = require("../utils/constants");

router.post(
  "/signed-url",
  authMiddleware({
    roles: [UserType.ADMIN, UserType.OPERATOR, UserType.CUSTOMER],
  }),
  getPreSignedController
);

router.post(
  "/logo",
  authMiddleware({
    roles: [UserType.ADMIN, UserType.OPERATOR, UserType.CUSTOMER],
  }),
  addCreateLogoController
);

module.exports = router;
