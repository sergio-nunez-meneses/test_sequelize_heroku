const db = require('../models/index');
const ash = require('express-async-handler');
const express = require('express');
const router = express.Router();

router.get('/', ash(async function(req, res, next) {
  const farmers = await db.Farm.findAll();
  console.log(farmers);

  if (farmers == null) {
    console.error(error);
  }

  res.render('index', {
    farmers: farmers
  });
}));

module.exports = router;
