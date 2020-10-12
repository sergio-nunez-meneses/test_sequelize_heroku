const db = require('../models/index');
const bcrypt = require('bcrypt');

const Joi = require('joi');
const schema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .required(),
  password: Joi.string()
    .min(6)
    .max(20)
    .required(),
  confirmPassword: Joi.string()
    .equal(Joi.ref('password'))
    .required(),
  role: Joi.string()
    .valid('admin', 'user')
    .required()
})
  .with('password', 'confirmPassword');

exports.signup = async function(req, res, next) {
  try {
    const formValidation = schema.validate(req.body);

    if (formValidation.error) {
      res.render('signup', { error: formValidation.error.details[0].message });
      return;
    }

    const user = await db.User.findOne({ where: { name: req.body.name } });

    if (user) {
      res.render('signup', { error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await db.User.create({
      name: req.body.name,
      password: hashedPassword,
      role: req.body.role,
      token: '{}'
    });
    console.log(newUser);
    res.redirect('/signin');
  } catch (error) {
    console.error(error);
  }
}
