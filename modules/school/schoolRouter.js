const schoolController = require("./schoolController");

const router = require("express").Router();

router.post("/", schoolController.create);
router.get("/", schoolController.getAll);
router.get("/:id", schoolController.getOne);
router.put("/:id", schoolController.updateSchool); //change
router.delete("/:id", schoolController.remove);
// router.post("/school-actor/:schoolId", schoolController.addActor); //change
router.get("/school-actor/:schoolId", schoolController.getSchoolActors); //change
router.get("/school-year/:schoolId", schoolController.getSchoolYears); //change

module.exports = router;
