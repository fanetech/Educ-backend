const classroumController = require("../../controllers/classroum/classroum.controller");
const router = require("express").Router();


router.post("/", classroumController.create);
router.get("/", classroumController.getAll);
router.get("/:id", classroumController.getOne);
router.post("/matter/:id", classroumController.matter);
router.post("/pupil/:id", classroumController.pupil);
router.post("/note/:id", classroumController.note);
router.post("/absence/:id", classroumController.absence);
router.post("/add-absence/:id", classroumController.addAbsence);
router.put("/:id", classroumController.update);
router.put("/matter/:id", classroumController.updateMatter);
router.put("/pupil/:id", classroumController.updatePupil);
router.put("/absence/:id", classroumController.updateAbsence);
module.exports = router;