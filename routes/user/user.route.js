const router = require("express").Router();
const userController = require("../../controllers/user/user.controller");

router.get("/", userController.getAllUser);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.remove);

module.exports = router;
