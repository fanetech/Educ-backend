const classroomController = require("./classroomController");
const router = require("express").Router();

router.post("/", classroomController.create);
router.get("/", classroomController.getAll);
router.get("/:id", classroomController.getOne);
router.put("/:id", classroomController.updateClassroom);
router.delete("/:id", classroomController.remove);
router.get("/query/:field/:value", classroomController.getClassroomByField);  //change

module.exports = router;