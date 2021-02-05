var express = require('express');
var router = express.Router();
const signupController = require('../controllers/signup');

router.get('/', function(req, res, next) {
  res.render('signup');
});

router.post('/', signupController.signup);

module.exports = router;
