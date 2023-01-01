const router = require("express").Router();
const directoryController = require("../../controllers/files/directory.controller");

router.post("/", directoryController.createDirectory);
router.get("/", directoryController.getAllDirectory);
router.get("/:id", directoryController.getOneDirectory);
router.get("/creator/:id", directoryController.getCreatorDirectory);

router.post("/file/:id", directoryController.createFile);

module.exports = router;
