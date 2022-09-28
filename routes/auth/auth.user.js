const router = require('express').Router();
const userAuthController = require('../../controllers/auth/user.auth.controller');

router.post('/register', userAuthController.register );
router.post('/login', userAuthController.login);

module.exports = router;
