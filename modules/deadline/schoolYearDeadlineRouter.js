const schoolYearDeadlineController = require("./schoolYearDeadlineController");
const router = require("express").Router();

router.post("/", schoolYearDeadlineController.create); //change
router.get("/", schoolYearDeadlineController.getAll); //change
router.get("/:id", schoolYearDeadlineController.getOne); //change
router.put("/:id", schoolYearDeadlineController.updateSchoolYearPeriod); //change
router.delete("/:id", schoolYearDeadlineController.remove); //change
router.get("/query/:field/:value", schoolYearDeadlineController.getschoolYearDeadlineByField); //change

module.exports = router;