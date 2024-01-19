const pupilAbsenceController = require("./absence.controller");
const router = require("express").Router();

router.post("/", pupilAbsenceController.create); // change
// router.get("/", pupilPeriodController.getAll); // change
// router.get("/:id", pupilPeriodController.getOne); // change
// router.delete("/:id", pupilPeriodController.remove); // change

module.exports = router;