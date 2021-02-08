const db = require('../models/index');
const ash = require('express-async-handler');
const mainController = require('./mainController');

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
  const keys = await mainController.checkEmptyFields(req, res);

  if (!keys) {
    return res.status(400).send({
      error: 'Request cannot be empty.'
    });
  }

  const model = await mainController.getModelNameFromUrl(req);
  await mainController.createInstance(req, res, schema, model);
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
