const db = require('../models/index');

exports.getAll = async function(req, res, next) {
  try {
    const farmers = await db.Farm.findAll();
    console.log(farmers);

    res.render('index', {
      farmers: farmers
    });
  } catch (error) {
    console.error(error);
  }
}

exports.insert = async function (req, res, next) {
  try {
    const newFarmer = await db.Farm.create({ ...req.body });
    console.log(newFarmer);
    const farmers = await db.Farm.findAll();

    res.render('index', {
      farmers: farmers
    });
  } catch (error) {
    console.error(error);
  }
}
