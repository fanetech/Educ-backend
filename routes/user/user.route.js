const router = require('express').Router();
const userController = require('../../controllers/user/user.controller');

router.get('/', userController.getAllUser );
router.get('/:id', userController.getUserById);

module.exports = router;
