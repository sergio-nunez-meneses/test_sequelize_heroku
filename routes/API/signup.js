const db = require('../../models/index');
const ash = require('express-async-handler');
const bcrypt = require('bcrypt');
const cors = require('cors');
const express = require('express');
const router = express.Router();

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

router.use(cors());

router.post('/', ash(async function(req, res, next) {
  console.log(req.body);

  const receivedForm = {
    name: req.body.name,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role
  }
  const formValidation = schema.validate(receivedForm);

  if (formValidation.error) {
    res.send({ error: formValidation.error.details[0].message });
    return;
  }

  const user = await db.User.findOne({ where: { name: req.body.name } });

  if (user) {
    res.send({ error: 'User already exists' });
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

  res.send({ success: 'User successfully registered!' });
}));

module.exports = router;
