const router = require("express").Router();
const userSchoolController = require("./userSchoolController");

router.get("/", userSchoolController.getAll); //change
router.get("/:id", userSchoolController.getOne); //change
router.put("/:id", userSchoolController.modify); //change
router.delete("/:id", userSchoolController.delete); //change

module.exports = router;