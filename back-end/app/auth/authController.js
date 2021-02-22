const db = require('../models/index');
const ash = require('express-async-handler');
const bcrypt = require('bcrypt');

const Joi = require('joi');
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
});

exports.login = ash(async function(req, res) {
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
      error: `User with email=${req.body.email} doesn't exist.`
    });
  }

  const passwordValidation = await bcrypt.compare(req.body.password, user.password);

  if (!passwordValidation) {
    return res.status(400).send({
      error: 'Invalid password.'
    });
  }

  const generatedJwt = await user.generateJwt(req.session.id);

  console.log('logged in:', req.session.id); // just for debugging

  if (typeof generatedJwt === 'object') {
    return res.status(500).send({
      error: generatedJwt['message']
    });
  }

  user.token = req.session.id;
  user = await user.save();

  // res.header('authorization', 'Bearer ' + generatedJwt);
  //   .status(200)
  //   .send({
  //     message: 'User signed in successfully!'
  //   });

  res.header('x-access-token', generatedJwt);
  res.status(200).send({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    accessToken: generatedJwt
  });
});

exports.logout = ash(async function(req, res) {
  console.log('logout:', req.session.id); // just for debugging

  var user = await db.User.findOne({
    where: {
      token: req.session.id
    }
  });

  if (user === null) {
    return res.status(500).send({
      error: `Cannot sign out user with token=${req.session.id}. Maybe user was not found.`
    });
  }

  user.token = '{}';
  user = await user.save();

  if (Object.keys(user).length === 0) {
    return res.status(500).send({
      error: 'An error occurred while signing out user.'
    });
  }

  await req.session.destroy(function(err) {
    if (err) {
      return res.status(500).send({
        error: 'An error occurred while signing out user.'
      });
    }
  });

  // res.header('x-access-token', '')
  //   .status(200)
  //   .send({
  //     message: 'User signed out successfully!'
  //   });

  res.status(200).send({
    message: 'User signed out successfully!'
  });
});
