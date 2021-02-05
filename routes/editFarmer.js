const db = require('../models/index');
const ash = require('express-async-handler');
const express = require('express');
const router = express.Router();

router.get('/:id', ash(async function (req, res, next) {
  const farmer = await db.Farm.findByPk(req.params.id);

  if (!farmer) {
    res.render('editFarmer', { error: "Farmer doesn't exist" });
    return;
  }

  res.render('editFarmer', { farmer: farmer });
}));

router.post('/', ash(async function(req, res, next) {
  const farmer = await db.Farm.update(
    { ...req.body },
    { where:
      { id: req.body.id }
    }
  );

  // await farmer.save();

  res.redirect('/displayFarmers');
}));

module.exports = router;
