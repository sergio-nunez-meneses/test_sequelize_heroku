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
