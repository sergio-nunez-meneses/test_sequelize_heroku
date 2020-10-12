var express = require('express');
var router = express.Router();
const logoutController = require('../controllers/logout');

router.all('/', logoutController.logout);

module.exports = router;
