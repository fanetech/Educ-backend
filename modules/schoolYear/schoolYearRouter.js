const schoolYearController = require("./schoolYearController");
const router = require("express").Router();

router.post("/", schoolYearController.create); //change 
router.get("/", schoolYearController.getAll); //change
router.get("/:id", schoolYearController.getOne); //change
router.put("/:id", schoolYearController.updateSchoolYear); //change
router.delete("/:id", schoolYearController.remove); //change
router.get("/query/:field/:value", schoolYearController.getUserSchoolByField); //change
router.get("/school-year-period/:schoolYearId", schoolYearController.getSchoolYearPeriods); //change
router.get("/school-year-deadline/:schoolYearId", schoolYearController.getSchoolYearDeadline); //change

module.exports = router;