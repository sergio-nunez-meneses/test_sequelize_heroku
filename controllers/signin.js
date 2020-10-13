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
    .required()
})

exports.signin = async function(req, res, next) {
  try {
    const formValidation = schema.validate(req.body);

    if (formValidation.error) {
      res.render('signin', { input: req.body, error: formValidation.error.details[0].message });
      return;
    }

    const user = await db.User.findOne({ where: { name: req.body.name } });

    if (!user) {
      res.render('signin', { error: "User doesn't exist" });
      return;
    }

    const passwordValidation = await bcrypt.compare(req.body.password, user.password);

    if (!passwordValidation) {
      res.render('signin', { error: 'Wrong password' });
      return;
    }

    const token = {};
    token[req.session.id] = new Date(Date.now());

    await db.User.update({
      token: JSON.stringify(token)
    }, {
      where: { name: req.body.name }
    });

    res.redirect('/displayFarmers');
  } catch (error) {
    console.error(error);
  }
}
