const db = require('../models/index');
const ash = require('express-async-handler');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
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

  // const formValidation = await createSchema.validate(req.body);
  //
  // if (formValidation.error) {
  //   res.status(400).send({
  //     error: formValidation.error.details[0].message
  //   });
  //   return;
  // }
  //
  // const userName = req.body.name;
  // var user = await db.User.findOne({
  //   where: {
  //     name: userName
  //   }
  // });
  //
  // if (user !== null) {
  //   res.status(500).send({
  //     error: `User name=${userName} already exists.`
  //   });
  //   return;
  // }
  //
  // const hashedPassword = await bcrypt.hash(req.body.password, 10);
  //
  // user = await db.User.create({
  //   name: userName,
  //   email: req.body.email,
  //   password: hashedPassword,
  //   role: req.body.role,
  //   token: '{}'
  // });
  //
  // if (user.length === 0) {
  //   res.status(500).send({
  //     error: 'An error occurred while creating user.'
  //   });
  //   return;
  // }
  //
  // res.status(200).send({
  //   message: 'User created successfully!'
  // });
  // return;
});

exports.findAll = ash(async function(req, res) {
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.findAllInstances(req, res, model);

  // console.log(req.query); // debug
  //
  // const name = req.query.name;
  // const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  //
  // const users = await db.User.findAll({
  //   limit: 5,
  //   where: condition
  // });
  //
  // if (users.length === 0) {
  //   res.status(500).send({
  //     error: 'An error occurred while retrieving  users. Maybe users were not found.'
  //   });
  //   return;
  // }
  //
  // res.status(200).send(users);
  // return;
});

exports.findOne = ash(async function(req, res) {
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.findOneInstance(req, res, model);

  // console.log(req.params); // debug
  //
  // const id = { id: req.params.id };
  // const user = await db.User.findOne({
  //   where: id
  // });
  //
  // if (user === null) {
  //   res.status(500).send({
  //     error: `Error retrieving user with id=${req.params.id}. Maybe user was not found.`
  //   });
  //   return;
  // }
  //
  // res.status(200).send(user);
  // return;
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
  // const user = await db.User.update(
  //   { ...req.body },
  //   { where: id }
  // );
  //
  // if (user.length === 0 || user === null) {
  //   res.status(500).send({
  //     error: `Error updating user with id=${req.params.id}.`
  //   });
  //   return;
  // }
  //
  // if (user != 1) {
  //   res.status(400).send({
  //     error: `Cannot update user with id=${req.params.id}. Maybe user was not found or fields are empty.`
  //   });
  //   return;
  // }
  //
  // res.status(200).send({
  //   message: 'User updated successfully!'
  // });
  // return;
});

exports.deleteAll = ash(async function(req, res) {
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.deleteAllInstances(req, res, model);

  // const users = await db.User.destroy({
  //   where: {},
  //   truncate: false
  // });
  //
  // if (users === 0) {
  //   res.status(500).send({
  //     error: 'An error occurred while removing all users. Maybe users were not found.'
  //   });
  //   return;
  // }
  //
  // res.status(200).send({
  //   message: `${users} users deleted successfully!`
  // });
  // return;
});

exports.deleteOne = ash(async function(req, res) {
  const model = await mainController.getModelNameFromUrl(req);
  await mainController.deleteOneInstance(req, res, model);

  // console.log(req.params); // debug
  //
  // const id = { id: req.params.id };
  // const user = await db.User.destroy({
  //   where: id
  // });
  //
  // if (user.length === 0 || user === null) {
  //   res.status(500).send({
  //     error: `Couldn't delete user with id=${req.params.id}.`
  //   });
  //   return;
  // }
  //
  // if (user != 1) {
  //   res.status(400).send({
  //     error: `Cannot delete user with id=${req.params.id}. Maybe user was not found.`
  //   });
  //   return;
  // }
  //
  // res.status(200).send({
  //   message: 'User deleted successfully!'
  // });
  // return;
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
