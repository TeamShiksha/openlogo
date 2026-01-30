const { getPreSignedController } = require("../controllers/catalog");
const {
  newLogoRequestController,
  updateLogoRequestController,
  getLogoRequestController,
} = require("../controllers/createLogoRequest");
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
  newLogoRequestController
);

router.put(
  "/:createLogoId",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  updateLogoRequestController
);

router.get(
  "/",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  getLogoRequestController
);

module.exports = router;
