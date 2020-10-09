const db = require('../models/index');

exports.getAll = async function(req, res, next) {
  const farmers = await db.Farm.findAll();
  console.log(farmers);
  res.render('index', {
    title: 'Express',
    farmers: farmers
  });
}

exports.create = function (req, res, next) {
  // const newFarmer = await db.Farm.create({ ...req.body });
  // const lastInserted = await db.Farm.findOne({ where: {} });
}
