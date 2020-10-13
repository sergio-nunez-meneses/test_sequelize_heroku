const db = require('../models/index');
const ash = require('express-async-handler');
const express = require('express');
const router = express.Router();

router.post('/', ash(async function(req, res, next) {
  await db.Farm.destroy({
    where:
      { id: req.body.id }
    });

  res.redirect('/displayFarmers');
}));

module.exports = router;
