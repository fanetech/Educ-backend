const classroomController = require("./classroomController");
const router = require("express").Router();

router.post("/", classroomController.create); //change 

module.exports = router;