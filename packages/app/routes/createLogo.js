const { getPreSignedController } = require("../controllers/catalog");
const {
  addCreateLogoController,
  updateCreateLogoController,
  getCreateLogosController,
  getCreateLogoByIdController,
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
  addCreateLogoController
);

router.put(
  "/:createLogoId",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  updateCreateLogoController
);

router.get(
  "/",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  getCreateLogosController
);

router.get(
  "/:createLogoId",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  getCreateLogoByIdController
);

module.exports = router;
