const db = require('../models/index');
const ash = require('express-async-handler');
const { Op } = require('sequelize');

exports.getModelNameFromUrl = async function(req) {
  var url = req.originalUrl.split('/');
  var model = [];

  if (url[2] === 'farmers') {
    model.push(db.Farmer, url[2]);
  } else if (url[2] === 'farms') {
    model.push(db.Farm, url[2]);
  } else if (url[2] === 'users') {
    model.push(db.User, url[2]);
  }

  return model;
}

exports.findAllInstances = async function(req, res, model) {
  console.log(req.query); // debug

  const name = req.query.name;
  const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  const instances = await model[0].findAll({
    limit: 5,
    where: condition
  });

  if (instances.length === 0) {
    res.status(500).send({
      error: `An error occurred while retrieving ${model[1]}. Maybe ${model[1]} were not found.`
    });
  }

  res.status(200).send(instances);
};

exports.findOneInstance = async function(req, res, model) {
  console.log(req.params); // debug

  const id = { id: req.params.id };
  const instance = await model[0].findOne({
    where: id
  });
  const instanceName = model[1].substring(0, model[1] - 1);

  if (instance === null) {
    res.status(500).send({
      error: `Error retrieving ${instanceName} with id=${req.params.id}. Maybe ${instanceName} was not found.`
    });
  }

  res.status(200).send(instance);
};
