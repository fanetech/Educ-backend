const schoolYearPeriodController = require("./schoolYearPeriodController");
const router = require("express").Router();

router.post("/", schoolYearPeriodController.create); //change
router.get("/", schoolYearPeriodController.getAll); //change
router.get("/:id", schoolYearPeriodController.getOne); //change
router.put("/:id", schoolYearPeriodController.updateSchoolYearPeriod); //change
router.delete("/:id", schoolYearPeriodController.remove); //change
router.get("/query/:field/:value", schoolYearPeriodController.getschoolYearPeriodByField); //change

module.exports = router;