const classroomController = require("./classroomController");
const router = require("express").Router();

router.post("/", classroomController.create); //change 
router.get("/", classroomController.getAll); //change
router.get("/:id", classroomController.getOne); //change
router.put("/:id", classroomController.updateClassroom); //change
router.delete("/:id", classroomController.remove); //change

module.exports = router;