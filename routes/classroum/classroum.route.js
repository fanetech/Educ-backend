const classroumController = require("../../controllers/classroum/classroum.controller");
const router = require("express").Router();


router.post("/", classroumController.create);
router.post("/matter/:id", classroumController.matter);
module.exports = router;