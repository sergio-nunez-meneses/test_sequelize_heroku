const db = require('../models/index');
const cors = require('cors');
var express = require('express');
var router = express.Router();

router.use(cors());

router.get('/', async function(req, res, next) {
  try {
    const farmers = await db.Farm.findAll();
    res.send(farmers);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
