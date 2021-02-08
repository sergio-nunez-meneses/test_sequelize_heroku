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

exports.checkEmptyFields = async function(req, res) {
  console.log(req.body); // debug

  const requestKeys = await Object.keys(req.body);

  if (requestKeys.length === 0) {
    res.status(400).send({
      error: 'Request cannot be empty.'
    });
  }

  return requestKeys;
};

exports.checkEmptyValues = async function(req, res, keys) {
  var error;

  await keys.forEach(function(key) {
    if (req.body[key] === '' || req.body[key] === undefined || req.body[key] === null) {
      error = true;
    }
  });

  if (error) {
    res.status(400).send({
      error: 'Fields cannot be empty.'
    });
  }
};

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

exports.updateInstance = async function(req, res, model) {
  console.log(req.params); // debug

  const id = { id: req.params.id };
  const instance = await model[0].update(
    { ...req.body },
    { where: id }
  );
  const instanceName = model[1].substring(0, model[1] - 1);

  if (instance.length === 0 || instance === null) {
    res.status(500).send({
      error: `Error updating ${instanceName} with id=${req.params.id}.`
    });
  }

  if (instance != 1) {
    res.status(400).send({
      error: `Cannot update ${instanceName} with id=${req.params.id}. Maybe ${instanceName} was not found or fields are empty.`
    });
  }

  res.status(200).send({
    message: `${instanceName} updated successfully!`
  });
};

exports.deleteAllInstances = async function(req, res, model) {
  const instances = await model[0].destroy({
    where: {},
    truncate: false
  });

  if (instances === 0) {
    res.status(500).send({
      error: `An error occurred while removing all ${model[1]}. Maybe ${model[1]} were not found.`
    });
  }

  res.status(200).send({
    message: `${instances} farmers deleted successfully!`
  });
};

exports.deleteOneInstance = async function(req, res, model) {
  console.log(req.params); // debug

  const id = { id: req.params.id };
  const instance = await model[0].destroy({
    where: id
  });
  const instanceName = model[1].substring(0, model[1].length - 1);

  if (instance.length === 0 || instance === null) {
    res.status(500).send({
      error: `Couldn't delete ${instanceName} with id=${req.params.id}.`
    });
  }

  if (instance != 1) {
    res.status(400).send({
      error: `Cannot delete ${instanceName} with id=${req.params.id}. Maybe ${instanceName} was not found.`
    });
  }

  res.status(200).send({
    message: `${instanceName} deleted successfully!`
  });
};
