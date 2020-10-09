const db = require('../models/index');

exports.getAll = async function(req, res, next) {
  const farmers = await db.Farm.findAll();
  console.log(farmers);

  res.render('index', {
    farmers: farmers
  });
}

exports.insert = async function (req, res, next) {
  const newFarmer = await db.Farm.create({ ...req.body });
  console.log(newFarmer);
  const farmers = await db.Farm.findAll();

  res.render('/', {
    farmers: farmers
  });
}
