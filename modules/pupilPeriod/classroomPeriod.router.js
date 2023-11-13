const classroomPeriodController = require("./classroomPeriod.controller");
const router = require("express").Router();

router.post("/", classroomPeriodController.create); // change
router.get("/", classroomPeriodController.getAll); // change
router.get("/:id", classroomPeriodController.getOne); // change
router.delete("/:id", classroomPeriodController.remove); // change

module.exports = router;