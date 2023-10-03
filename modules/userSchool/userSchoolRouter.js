const router = require("express").Router();
const userSchoolController = require("./userSchoolController");

router.post("/", userSchoolController.create); //change
router.get("/", userSchoolController.getAll); //change
router.get("/:id", userSchoolController.getOne); //change
router.put("/:id", userSchoolController.modify); //change
router.delete("/:id", userSchoolController.delete); //change
router.get("/query/:field/:value", userSchoolController.getUserSchoolByField); //change

module.exports = router;