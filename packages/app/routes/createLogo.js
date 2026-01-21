const { getPreSignedController } = require("../controllers/catalog");
const {
  addLogoController,
  updateLogoController,
  getLogoController,
} = require("../controllers/createLogo");
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
  addLogoController
);

router.put(
  "/:createLogoId",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  updateLogoController
);

router.get(
  "/",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  getLogoController
);

module.exports = router;
