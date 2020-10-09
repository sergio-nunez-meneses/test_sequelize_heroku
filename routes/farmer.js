const db = require('../models/index');
const farmerController = require('../controllers/farmer');
var express = require('express');
var router = express.Router();

router.post('/', farmerController.insert);

module.exports = router;
