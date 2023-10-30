const schoolYearController = require("./schoolYearController");
const router = require("express").Router();

router.post("/", schoolYearController.create);   
router.get("/", schoolYearController.getAll);  
router.get("/:id", schoolYearController.getOne);  
router.put("/:id", schoolYearController.updateSchoolYear);  
router.delete("/:id", schoolYearController.remove);  
router.get("/query/:field/:value", schoolYearController.getUserSchoolByField);  
router.get("/school-year-period/:schoolYearId", schoolYearController.getSchoolYearPeriods);  
router.get("/school-year-deadline/:schoolYearId", schoolYearController.getSchoolYearDeadline);
router.get("/school-year-classroom/:schoolYearId", schoolYearController.getSchoolYearClassroom); //change

module.exports = router;