const db = require('../models/index');
const ash = require('express-async-handler');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

exports.getModelNameFromUrl = async function(req) {
  var data = [];
  const url = req.originalUrl.split('/');
  const endpoint = url[2].includes('?') ? url[2].split('?')[0] : url[2];

  data.push(endpoint);

  if (endpoint === 'farmers') {
    data.unshift(db.Farmer);
  } else if (endpoint === 'farms') {
    data.unshift(db.Farm);
  } else if (endpoint === 'users') {
    data.unshift(db.User);
  }

  return data;
}

exports.checkEmptyFields = async function(req, res) {
  var requestKeys = await Object.keys(req.body);
  var error;

  if (requestKeys.length === 0) {
    error = true;
  }

  if (error) {
    return false;
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
    return false;
  }

  return true;
};

exports.createInstance = async function(req, res, schema, model) {
  const formValidation = await schema.validate(req.body);

  if (formValidation.error) {
    return res.status(400).send({
      error: formValidation.error.details[0].message
    });
  }

  const name = { name: req.body.name };
  var instance = await model[0].findOne({
    where: name
  });
  const instanceName = model[1].substring(0, model[1].length - 1);

  if (instance !== null) {
    return res.status(500).send({
      error: `${instanceName} name=${req.body.name} already exists.`
    });
  }

  if (instanceName === 'user') {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    instance = await model[0].create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      token: '{}'
    });
  } else {
    instance = await model[0].create(
      { ...req.body }
    );
  }

  if (instance.length === 0) {
    return res.status(500).send({
      error: `An error occurred while creating ${instanceName}.`
    });
  }

  res.status(200).send({
    message: `${instanceName} created successfully!`
  });
};

exports.findAllInstances = async function(req, res, model) {
  var keys;

  if (Object.keys(req.query).length > 0) {
    keys = Object.keys(req.query);

    for (var key of keys) {
      req.query[key] = { [Op.like]: `%${req.query[key]}%` };
    }
  }

  const instances = await model[0].findAll({
    limit: 5,
    where: req.query
  });

  if (instances.length === 0) {
    return res.status(500).send({
      error: `An error occurred while retrieving ${model[1]}. Maybe ${model[1]} were not found.`
    });
  }

  res.status(200).send(instances);
};

exports.findOneInstance = async function(req, res, model) {
  const id = { id: req.params.id };
  const instance = await model[0].findOne({
    where: id
  });
  const instanceName = model[1].substring(0, model[1].length - 1);

  if (instance === null) {
    return res.status(500).send({
      error: `Error retrieving ${instanceName} with id=${req.params.id}. Maybe ${instanceName} was not found.`
    });
  }

  res.status(200).send(instance);
};

exports.updateInstance = async function(req, res, model) {
  const id = { id: req.params.id };
  const instance = await model[0].update(
    { ...req.body },
    { where: id }
  );
  const instanceName = model[1].substring(0, model[1].length - 1);

  if (instance.length === 0 || instance === null) {
    return res.status(500).send({
      error: `Error updating ${instanceName} with id=${req.params.id}.`
    });
  }

  if (instance != 1) {
    return res.status(400).send({
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
    return res.status(500).send({
      error: `An error occurred while removing all ${model[1]}. Maybe ${model[1]} were not found.`
    });
  }

  res.status(200).send({
    message: `${instances} ${model[1]} deleted successfully!`
  });
};

exports.deleteOneInstance = async function(req, res, model) {
  const id = { id: req.params.id };
  const instance = await model[0].destroy({
    where: id
  });
  const instanceName = model[1].substring(0, model[1].length - 1);

  if (instance.length === 0 || instance === null) {
    return res.status(500).send({
      error: `Couldn't delete ${instanceName} with id=${req.params.id}.`
    });
  }

  if (instance != 1) {
    return res.status(400).send({
      error: `Cannot delete ${instanceName} with id=${req.params.id}. Maybe ${instanceName} was not found.`
    });
  }

  res.status(200).send({
    message: `${instanceName} deleted successfully!`
  });
};
