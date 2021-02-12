const router = require('express').Router();
const authController = require('./authController');

router.post('/login', authController.login);

module.exports = router;
