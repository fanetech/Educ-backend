const noteController = require("./note.controller");
const router = require("express").Router();

router.post("/", noteController.create); // change
router.get("/", noteController.getAll); // change
router.get("/:id", noteController.getOne); // change
router.put("/:id", noteController.updatePupil); // change
router.delete("/:id", noteController.remove); // change

module.exports = router;