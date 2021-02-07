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

  if (!farm) {
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
      error: 'An error occurred while retrieving  farm. Maybe farm were not found.'
    });
    return;
  }

  res.status(200).send(farm);
  return;
});
