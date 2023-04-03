const schoolController = require("../../controllers/school/school.controller");

const router = require("express").Router();

// school route
router.post("/", schoolController.create);
router.get("/", schoolController.getAll);
router.get("/user", schoolController.getSchoolOfUser);
router.get("/:id", schoolController.getOne);
router.delete("/:id", schoolController.remove);
router.delete("/soft/:id", schoolController.softDelete);

//year route
router.put("/year/:id", schoolController.createYearSchool);
router.put("/year/period/:id", schoolController.createYearSchoolPeriod);
router.put("/year/deadline/:id", schoolController.createYearSchoolDeadline);

//update
router.patch("/update/:id", schoolController.updateSchool);
router.patch("/update/year/:id", schoolController.updateSchoolYear);
router.patch("/update/period/:id", schoolController.updateSchoolYearPeriod);
router.patch("/update/actor/:id", schoolController.updateSchoolActor);
router.patch("/update/deadline/:id", schoolController.updateSchoolYearDeadline);

//library route
router.post("/library/:id", schoolController.createLibrary);
router.put("/library/:id", schoolController.createLibraryFile);

// school actor
router.put("/actor/:id", schoolController.createSchoolActor);

//year

module.exports = router;
