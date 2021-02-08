const db = require('../models/index');
const ash = require('express-async-handler');
const { Op } = require('sequelize');
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
  console.log(req.body); // debug

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

  const farmer = await db.Farmer.create(
    { ...req.body }
  );

  if (farmer.length === 0) {
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
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.findAllInstances(req, res, model);

  // const name = req.query.name;
  // const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  //
  // const farmers = await db.Farmer.findAll({
  //   limit: 5,
  //   where: condition
  // });
  //
  // if (farmers.length === 0) {
  //   res.status(500).send({
  //     error: 'An error occurred while retrieving  farmers. Maybe farmers were not found.'
  //   });
  //   return;
  // }
  //
  // res.status(200).send(farmers);
  // return;
});

exports.findOne = ash(async function(req, res) {
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.findOneInstance(req, res, model);

  // console.log(req.params); // debug
  //
  // const id = { id: req.params.id };
  // const farmer = await db.Farmer.findOne({
  //   where: id
  // });
  //
  // if (farmer === null) {
  //   res.status(500).send({
  //     error: `Error retrieving farmer with id=${req.params.id}. Maybe farmer was not found.`
  //   });
  //   return;
  // }
  //
  // res.status(200).send(farmer);
  // return;
});

exports.update = ash(async function(req, res) {
  const keys = await mainController.checkEmptyFields(req, res);
  await mainController.checkEmptyValues(req, res, keys);

  const model = await mainController.getModelNameFromUrl(req);
  await mainController.updateInstance(req, res, model);

  // console.log(req.params); // debug
  // console.log(req.body); // debug
  //
  // const requestKeys = Object.keys(req.body);
  //
  // if (requestKeys.length === 0) {
  //   res.status(400).send({
  //     error: 'Fields cannot be empty.'
  //   });
  //   return;
  // }
  //
  // var error;
  //
  // requestKeys.forEach(async function(key) {
  //   if (req.body[key] === '' || req.body[key] === undefined) {
  //     error = true;
  //   }
  // });
  //
  // if (error) {
  //   res.status(400).send({
  //     error: 'Fields cannot be empty.'
  //   });
  //   return;
  // }
  //
  // const id = { id: req.params.id };
  // const farmer = await db.Farmer.update(
  //   { ...req.body },
  //   { where: id }
  // );
  //
  // if (farmer.length === 0 || farmer === null) {
  //   res.status(500).send({
  //     error: `Error updating farmer with id=${req.params.id}.`
  //   });
  //   return;
  // }
  //
  // if (farmer != 1) {
  //   res.status(400).send({
  //     error: `Cannot update farmer with id=${req.params.id}. Maybe farmer was not found or fields are empty.`
  //   });
  //   return;
  // }
  //
  // res.status(200).send({
  //   message: 'Farmer updated successfully!'
  // });
  // return;
});

exports.deleteAll = ash(async function(req, res) {
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.deleteAllInstances(req, res, model);

  // const farmers = await db.Farmer.destroy({
  //   where: {},
  //   truncate: false
  // });
  //
  // if (farmers === 0) {
  //   res.status(500).send({
  //     error: 'An error occurred while removing all farmers. Maybe farmers were not found.'
  //   });
  //   return;
  // }
  //
  // res.status(200).send({
  //   message: `${farmers} farmers deleted successfully!`
  // });
  // return;
});

exports.deleteOne = ash(async function(req, res) {
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.deleteOneInstance(req, res, model);

  // console.log(req.params); // debug
  //
  // const id = { id: req.params.id };
  // const farmer = await db.Farmer.destroy({
  //   where: id
  // });
  //
  // if (farmer.length === 0 || farmer === null) {
  //   res.status(500).send({
  //     error: `Couldn't delete farmer with id=${req.params.id}.`
  //   });
  //   return;
  // }
  //
  // if (farmer != 1) {
  //   res.status(400).send({
  //     error: `Cannot delete farmer with id=${req.params.id}. Maybe farmer was not found.`
  //   });
  //   return;
  // }
  //
  // res.status(200).send({
  //   message: 'Farmer deleted successfully!'
  // });
  // return;
});
