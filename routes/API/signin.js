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
    .required()
})

router.use(cors());

router.post('/', ash(async function(req, res, next) {
  res.send({ query: req.body });

  const formValidation = schema.validate({
    name: req.body.name,
    password: req.body.password
  });

  if (formValidation.error) {
    res.send({ error: formValidation.error.details[0].message });
    return;
  }

  const user = await db.User.findOne({ where: { name: req.body.name } });

  if (!user) {
    res.send({ error: "User doesn't exist" });
    return;
  }

  const passwordValidation = await bcrypt.compare(req.body.password, user.password);

  if (!passwordValidation) {
    res.send({ error: 'Wrong password' });
    return;
  }

  const token = {};
  token[req.session.id] = new Date(Date.now());

  await db.User.update({
    token: JSON.stringify(token)
  }, {
    where: { name: req.body.name }
  });

  res.send({});
}));

module.exports = router;
