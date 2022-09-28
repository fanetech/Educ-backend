const router = require('express').Router();
const customMailController = require('../../controllers/mails/customMail.controller')

router.post('/custom', customMailController.customEmail )

module.exports = router