const router = require('express').Router();
const userAuthController = require('./authUserController');

router.post('/register', userAuthController.register );
router.post('/login', userAuthController.login);

module.exports = router;
