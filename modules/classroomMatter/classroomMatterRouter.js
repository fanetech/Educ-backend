const classroomMatterController = require("./classroomMatterControler");
const router = require("express").Router();

router.post("/", classroomMatterController.create); //change
router.get("/", classroomMatterController.getAll); //change
router.get("/:id", classroomMatterController.getOne); //change
router.put("/:id", classroomMatterController.updateClassroom); //change
router.delete("/:id", classroomMatterController.remove); //clange
router.get("/query/:field/:value", classroomMatterController.getClassroomMatterByField);  //change

module.exports = router;