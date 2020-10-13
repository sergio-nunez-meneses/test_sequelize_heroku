const db = require('../models/index');
const ash = require('express-async-handler');
const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('insertFarmer');
});

router.post('/', ash(async function(req, res, next) {
  const newFarmer = await db.Farm.create({ ...req.body });
  const farmers = await db.Farm.findAll();

  res.render('index', {
    farmers: farmers
  });

  console.error(error);
}));

module.exports = router;
