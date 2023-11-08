const pupilController = require("./pupil.controller");
const router = require("express").Router();

router.post("/", pupilController.create); // change
router.get("/", pupilController.getAll); // change
router.get("/:id", pupilController.getOne); // change
router.put("/:id", pupilController.updatePupil); // change
router.delete("/:id", pupilController.remove); // change
router.get("/query/:field/:value", pupilController.getPupilByField);  //change
router.get("/pupil-period/:pupilId", pupilController.getPupilPeriods);  

module.exports = router;