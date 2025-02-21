const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  getUserDataController,
  updateProfileController,
  deleteUserAccountController,
  generateKeyController,
  destroyKeyController,
  updatePasswordController,
  logoRequestController,
} = require("../controllers/users");

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Retrieve user information
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Retrieve user profile, subscription, and API key information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The user's last name
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       description: The user's email
 *                       example: johndoe@gmail.com
 *                     userId:
 *                       type: string
 *                       description: The user ID
 *                       example: 672fa704e0af81f237142905
 *                     userType:
 *                       type: string
 *                       description: The user's type
 *                       example: CUSTOMER
 *                     subscription:
 *                       type: object
 *                       properties:
 *                         subscriptionId:
 *                           type: string
 *                           description: The subscription ID
 *                           example: 672fa704e0af81f237142908
 *                         subscriptionType:
 *                           type: string
 *                           description: The subscription type
 *                           example: HOBBY
 *                         keyLimit:
 *                           type: integer
 *                           description: The key limit for the subscription
 *                           example: 2
 *                         usageLimit:
 *                           type: integer
 *                           description: The usage limit for the subscription
 *                           example: 500
 *                         usageCount:
 *                           type: integer
 *                           description: The current usage count
 *                           example: 0
 *                         isActive:
 *                           type: boolean
 *                           description: Whether the subscription is active
 *                           example: true
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           description: The last update date of the subscription
 *                           example: 2024-12-09T18:45:12.704Z
 *                     keys:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           keyId:
 *                             type: string
 *                             description: The key ID
 *                             example: 673063b210bf0bc1f1663351
 *                           keyDescription:
 *                             type: string
 *                             description: The key description
 *                             example: Dev server
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The last update date of the key
 *                             example: 2024-11-10T07:41:38.224Z
 */
router.get("/", authMiddleware(), getUserDataController);
router.patch("/", authMiddleware(), updateProfileController);
router.delete("/", authMiddleware(), deleteUserAccountController);
router.post("/api-key", authMiddleware(), generateKeyController);
router.delete("/api-key/:keyId", authMiddleware(), destroyKeyController);
router.put("/password", authMiddleware(), updatePasswordController);
router.post("/request", authMiddleware(), logoRequestController);

module.exports = router;
