const router = require("express").Router();
const userController = require("./userController");

router.get("/", userController.getAllUser);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.remove);

module.exports = router;
