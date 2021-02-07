const db = require('../models/index');
const ash = require('express-async-handler');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const Joi = require('joi');
const createSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .required(),
  email: Joi.string()
    .min(5)
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ['com', 'fr', 'net']
      }
    })
    .required(),
  password: Joi.string()
    .min(6)
    .max(20)
    .required(),
  confirmPassword: Joi.string()
    .equal(Joi.ref('password'))
    .required(),
  role: Joi.string()
    .valid('Admin', 'User')
    .required()
})
  .with('password', 'confirmPassword');

exports.create = ash(async function(req, res) {
  console.log(req.body); // debug

  const requestKeys = Object.keys(req.body);

  if (requestKeys.length === 0) {
    res.status(400).send({
      error: 'Fields cannot be empty.'
    });
    return;
  }

  const formValidation = createSchema.validate(req.body);

  if (formValidation.error) {
    res.status(400).send({
      error: formValidation.error.details[0].message
    });
    return;
  }

  const userName = req.body.name;
  var user = await db.User.findOne({
    where: {
      name: req.body.name
    }
  });

  if (user !== null) {
    res.status(500).send({
      error: `User ${userName} already exists.`
    });
    // return;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  user = await db.User.create({
    name: userName,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    token: '{}'
  });

  if (user.length === 0) {
    res.status(500).send({
      error: 'An error occurred while creating user.'
    });
    return;
  }

  res.status(200).send({
    message: 'User created successfully!'
  });
  return;
});
