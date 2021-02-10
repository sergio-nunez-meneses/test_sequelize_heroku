const db = require('../models/index');
const ash = require('express-async-handler');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const mainController = require('./mainController');

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

const signInSchema = Joi.object({
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
    .required()
})

exports.create = ash(async function(req, res) {
  const keys = await mainController.checkEmptyFields(req, res);

  if (!keys) {
    return res.status(400).send({
      error: 'Request cannot be empty.'
    });
  }

  const model = await mainController.getModelNameFromUrl(req);
  await mainController.createInstance(req, res, createSchema, model);
});

exports.findAll = ash(async function(req, res) {
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.findAllInstances(req, res, model);
});

exports.findOne = ash(async function(req, res) {
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.findOneInstance(req, res, model);
});

exports.update = ash(async function(req, res) {
  const keys = await mainController.checkEmptyFields(req, res);

  if (!keys) {
    return res.status(400).send({
      error: 'Request cannot be empty.'
    });
  }

  const values = await mainController.checkEmptyValues(req, res, keys);

  if (!values) {
    return res.status(400).send({
      error: 'Fields cannot be empty.'
    });
  }

  const model = await mainController.getModelNameFromUrl(req);
  await mainController.updateInstance(req, res, model);
});

exports.deleteAll = ash(async function(req, res) {
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.deleteAllInstances(req, res, model);
});

exports.deleteOne = ash(async function(req, res) {
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.deleteOneInstance(req, res, model);
});

exports.signIn = ash(async function(req, res) {
  console.log(req.body); // debug

  const requestKeys = Object.keys(req.body);

  if (requestKeys.length === 0) {
    return res.status(400).send({
      error: 'Fields cannot be empty.'
    });
  }

  const formValidation = await signInSchema.validate(req.body);

  if (formValidation.error) {
    return res.status(400).send({
      error: formValidation.error.details[0].message
    });
  }

  const userEmail = { email: req.body.email };
  var user = await db.User.findOne({
    where: userEmail
  });

  if (user === null) {
    return res.status(500).send({
      error: `User with email=${userEmail} doesn't exist.`
    });
  }

  const passwordValidation = await bcrypt.compare(req.body.password, user.password);

  if (!passwordValidation) {
    return res.status(400).send({
      error: 'Invalid password.'
    });
  }

  const token = {};
  var date = new Date(Date.now());
  date.setHours(date.getHours() + 1);
  token[req.session.id] = date;

  user.token = JSON.stringify(token);
  user = await user.save();

  if (user.length === 0) {
    return res.status(500).send({
      error: 'An error occurred while signing in user.'
    });
  }

  res.status(200).send({
    message: 'User signed in successfully!'
  });
});

exports.signOut = ash(async function(req, res) {
  var user = await db.User.findOne({
    where: {
      token: {
        [Op.substring]: req.session.id
      }
    }
  });

  if (user === null) {
    return res.status(500).send({
      error: `Cannot sign out user with token=${req.session.id}. Maybe user was not found.`
    });
  }

  const token = JSON.parse(user.dataValues.token);
  delete token[req.session.id];

  user.token = JSON.stringify(token);
  user = await user.save();

  if (user.length === 0) {
    return res.status(500).send({
      error: 'An error occurred while signing out user.'
    });
  }

  res.status(200).send({
    message: 'User signed out successfully!'
  });
});