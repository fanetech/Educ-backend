const router = require("express").Router();
const fileController = require("../../controllers/files/files.controller");

router.post("/", fileController.create);

module.exports = router;
