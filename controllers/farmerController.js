const db = require('../models/index');
const ash = require('express-async-handler');
const { Op } = require('sequelize');

const Joi = require('joi');
const schema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(20)
    .required(),
  email: Joi.string()
    .min(6)
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ['fr', 'com', 'org', 'net']
      }
    })
    .required(),
  phone: Joi.string()
    .min(8)
    .required(),
});

exports.create = ash(async function(req, res) {
  console.log(req.body); // debug

  if (req.body.name === null && req.body.email === null && req.body.phone === null) {
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

  const farmer = await db.Farmer.create(
    { ...req.body }
  );

  if (!farmer) {
    res.status(500).send({
      error: 'An error occurred while creating farmer.'
    });
    return;
  }

  res.status(200).send({
    message: 'Farmer created successfully!'
  });
  return;
});

exports.findAll = ash(async function(req, res) {
  console.log(req.query); // debug

  const name = req.query.name;
  const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  const farmers = await db.Farmer.findAll({
    limit: 5,
    where: condition
  });

  if (!farmers) {
    res.status(500).send({
      error: 'An error occurred while retrieving  farmers. Maybe farmers were not found.'
    });
    return;
  }

  res.status(200).send(farmers);
  return;
});

exports.findOne = ash(async function(req, res) {
  console.log(req.params); // debug

  const id = { id: req.params.id };
  const farmer = await db.Farmer.findOne({
    where: id
  });

  if (!farmer) {
    res.status(500).send({
      error: `Error retrieving farmer with id=' + ${req.params.id}. Maybe farmer was not found.`
    });
    return;
  }

  res.status(200).send(farmer);
  return;
});

exports.update = ash(async function(req, res) {
  console.log(req.params); // debug
  console.log(req.body); // debug

  if (req.body === '') {
    res.status(400).send({
      error: 'Fields cannot be empty.'
    });
    return;
  }

  const requestKeys = Object.keys(req.body);
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
  const farmer = await db.Farmer.update(
    { ...req.body },
    { where: id }
  );

  if (!farmer) {
    res.status(500).send({
      error: `Error updating farmer with id=' + ${req.params.id}.`
    });
    return;
  }

  if (farmer != 1) {
    res.status(400).send({
      error: `Cannot update farmer with id=${req.params.id}. Maybe farmer was not found or fields are empty.`
    });
    return;
  }

  res.status(200).send({
    message: 'Farmer updated successfully!'
  });
  return;
})
