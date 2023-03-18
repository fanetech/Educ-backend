const classroumController = require("../../controllers/classroum/classroum.controller");
const router = require("express").Router();


router.post("/", classroumController.create);
router.get("/", classroumController.getAll);
router.get("/:id", classroumController.getOne);
router.post("/matter/:id", classroumController.matter);
router.post("/pupil/:id", classroumController.pupil);
router.post("/note/:id", classroumController.note);
router.put("/:id", classroumController.update);
router.put("/pupil/:id", classroumController.updatePupil);
module.exports = router;