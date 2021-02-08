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
      name: userName
    }
  });

  if (user !== null) {
    res.status(500).send({
      error: `User name=${userName} already exists.`
    });
    return;
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

exports.signIn = ash(async function(req, res) {
  console.log(req.body); // debug

  const requestKeys = Object.keys(req.body);

  if (requestKeys.length === 0) {
    res.status(400).send({
      error: 'Fields cannot be empty.'
    });
    return;
  }

  const formValidation = signInSchema.validate(req.body);

  if (formValidation.error) {
    res.status(400).send({
      error: formValidation.error.details[0].message
    });
    return;
  }

  const userEmail = { email: req.body.email };
  var user = await db.User.findOne({
    where: userEmail
  });

  if (user === null) {
    res.status(500).send({
      error: `User with email=${userEmail} doesn't exist.`
    });
    return;
  }

  const passwordValidation = await bcrypt.compare(req.body.password, user.password);

  if (!passwordValidation) {
    res.status(400).send({
      error: 'Invalid password.'
    });
    return;
  }

  const token = {};
  var date = new Date(Date.now());
  date.setHours(date.getHours() + 1);
  token[req.session.id] = date;

  user.token = JSON.stringify(token);
  user = await user.save();

  if (user.length === 0) {
    res.status(500).send({
      error: 'An error occurred while signing in user.'
    });
    return;
  }

  res.status(200).send({
    message: 'User signed in successfully!'
  });
  return;
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
    res.status(500).send({
      error: `Cannot sign out user with token=${req.session.id}. Maybe user was not found.`
    });
    return;
  }

  const token = JSON.parse(user.dataValues.token);
  delete token[req.session.id];

  user.token = JSON.stringify(token);
  user = await user.save();

  if (user.length === 0) {
    res.status(500).send({
      error: 'An error occurred while signing out user.'
    });
    return;
  }

  res.status(200).send({
    message: 'User signed out successfully!'
  });
  return;
});
