const router = require("express").Router();
const schoolActorController = require("./schoolActorController");

router.post("/", schoolActorController.create); //change
router.get("/", schoolActorController.getAll); //change
router.get("/:id", schoolActorController.getOne); //change
router.put("/:id", schoolActorController.modify); //change
router.delete("/:id", schoolActorController.delete); //change
router.get("/query/:field/:value", schoolActorController.getActorByField); //change

module.exports = router;