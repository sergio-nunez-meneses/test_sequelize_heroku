const db = require('../models/index');
const ash = require('express-async-handler');
const { Op } = require('sequelize');

const Joi = require('joi');
const schema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required(),
  address: Joi.string()
    .min(2)
    .required(),
  city: Joi.string()
    .min(2)
    .max(50)
    .required(),
  coordinates: Joi.string()
    .min(2)
    .max(30)
    .required()
});

exports.create = ash(async function(req, res) {
  console.log(req.body); // debug

  const requestKeys = Object.keys(req.body);

  if (requestKeys.length === 0) {
    res.status(400).send({
      error: 'Fields cannot be empty.'
    });
    return;
  }

  const formValidation = schema.validate(req.body);

  if (formValidation.error) {
    res.status(400).send({
      error: formValidation.error.details[0].message
    });
    return;
  }

  const farm = await db.Farm.create(
    { ...req.body }
  );

  if (farm.length === 0) {
    res.status(500).send({
      error: 'An error occurred while creating farm.'
    });
    return;
  }

  res.status(200).send({
    message: 'Farm created successfully!'
  });
  return;
});

exports.findAll = ash(async function(req, res) {
  console.log(req.query); // debug

  const name = req.query.name;
  const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  const farm = await db.Farm.findAll({
    limit: 5,
    where: condition
  });

  if (farm.length === 0) {
    res.status(500).send({
      error: 'An error occurred while retrieving  farms. Maybe farm were not found.'
    });
    return;
  }

  res.status(200).send(farm);
  return;
});

exports.findOne = ash(async function(req, res) {
  console.log(req.params); // debug

  const id = { id: req.params.id };
  const farm = await db.Farm.findOne({
    where: id
  });

  if (farm === null) {
    res.status(500).send({
      error: `Error retrieving farm with id=${req.params.id}. Maybe farm was not found.`
    });
    return;
  }

  res.status(200).send(farm);
  return;
});

exports.update = ash(async function(req, res) {
  console.log(req.params); // debug
  console.log(req.body); // debug

  const requestKeys = Object.keys(req.body);

  if (requestKeys.length === 0) {
    res.status(400).send({
      error: 'Fields cannot be empty.'
    });
    return;
  }

  var error;

  requestKeys.forEach(async function(key) {
    if (req.body[key] === '' || req.body[key] === undefined) {
      error = true;
    }
  });

  if (error) {
    res.status(400).send({
      error: 'Fields cannot be empty.'
    });
    return;
  }

  const id = { id: req.params.id };
  const farm = await db.Farm.update(
    { ...req.body },
    { where: id }
  );

  if (farm.length === 0 || farm === null) {
    res.status(500).send({
      error: `Error updating farm with id=${req.params.id}.`
    });
    return;
  }

  if (farm != 1) {
    res.status(400).send({
      error: `Cannot update farm with id=${req.params.id}. Maybe farm was not found or fields are empty.`
    });
    return;
  }

  res.status(200).send({
    message: 'Farm updated successfully!'
  });
  return;
});

exports.deleteAll = ash(async function(req, res) {
  const farms = await db.Farm.destroy({
    where: {},
    truncate: false
  });

  if (farms === 0) {
    res.status(500).send({
      error: 'An error occurred while removing all farms. Maybe farms were not found.'
    });
    return;
  }

  res.status(200).send({
    message: `${farms} farms deleted successfully!`
  });
  return;
});

exports.deleteOne = ash(async function(req, res) {
  console.log(req.params); // debug

  const id = { id: req.params.id };
  const farm = await db.Farm.destroy({
    where: id
  });

  if (farm.length === 0 || farm === null) {
    res.status(500).send({
      error: `Couldn't delete farm with id=' + ${req.params.id}.`
    });
    return;
  }

  if (farm != 1) {
    res.status(400).send({
      error: `Cannot delete farm with id=${req.params.id}. Maybe farm was not found.`
    });
    return;
  }

  res.status(200).send({
    message: 'Farm deleted successfully!'
  });
  return;
});
