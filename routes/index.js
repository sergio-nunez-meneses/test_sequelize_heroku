const db = require('../models/index');
var express = require('express');
var router = express.Router();//hh

router.get('/', async function(req, res, next) {
  try {
    const test = await db.Farm.create();
    const resultat = await db.Farm.findOne();
    console.log(resultat);
    res.render('index', { title: 'Express' });
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
