const schoolYearController = require("./schoolYearController");
const router = require("express").Router();

router.post("/", schoolYearController.create);

module.exports = router;