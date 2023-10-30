const classroomTeacherController = require("./classroomTeacherController");
const router = require("express").Router();

router.post("/", classroomTeacherController.create); //change
router.get("/", classroomTeacherController.getAll); //change
router.get("/:id", classroomTeacherController.getOne); //change
router.put("/:id", classroomTeacherController.updateClassroom); //change
router.delete("/:id", classroomTeacherController.remove); //clange

module.exports = router;