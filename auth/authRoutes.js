const router = require('express').Router();
const authController = require('./authController');

router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
