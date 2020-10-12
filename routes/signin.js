var express = require('express');
var router = express.Router();
const signinController = require('../controllers/signin');

router.get('/', function(req, res, next) {
  res.render('signin');
});

router.post('/', signinController.signin);

module.exports = router;
