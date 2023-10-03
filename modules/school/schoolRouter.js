const schoolController = require("./schoolController");

const router = require("express").Router();

// school route
router.post("/", schoolController.create);
router.get("/", schoolController.getAll);
router.get("/:id", schoolController.getOne);
router.put("/:id", schoolController.updateSchool); //change
router.delete("/:id", schoolController.remove);
router.post("/school-actor/:id", schoolController.addActor); //change
router.get("/school-actor/:id", schoolController.getSchoolActors); //change
// router.delete("/soft/:id", schoolController.softDelete);

// //year route
// router.put("/year/:id", schoolController.createYearSchool);
// router.put("/year/period/:id", schoolController.createYearSchoolPeriod);
// router.put("/year/deadline/:id", schoolController.createYearSchoolDeadline);

// //update
// router.patch("/update/year/:id", schoolController.updateSchoolYear);
// router.patch("/update/period/:id", schoolController.updateSchoolYearPeriod);
// router.patch("/update/deadline/:id", schoolController.updateSchoolYearDeadline);

// //library route
// router.post("/library/:id", schoolController.createLibrary);
// router.put("/library/:id", schoolController.createLibraryFile);

// // school actor
// router.patch("/update/actor/:id", schoolController.updateSchoolActor);

//year

module.exports = router;
