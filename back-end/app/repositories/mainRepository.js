const db = require('../models/index');
const ash = require('express-async-handler');
const bcrypt = require('bcrypt');

exports.createOne = ash(async function() {
  if (arguments.length > 2 && arguments[2] === 'user') {
    const hashedPassword = await bcrypt.hash(arguments[1].password, 10);

    return await arguments[0].create({
      name: arguments[1].name,
      email: arguments[1].email,
      password: hashedPassword,
      role: arguments[1].role,
      token: '{}'
    });
  }

  return await arguments[0].create(
    { ...arguments[1] }
  );
});

exports.find = ash(async function() {
  if (arguments.length > 2) {
    return await arguments[0].findAll({
      limit: arguments[2],
      where: arguments[1]
    });
  } else {
    return await arguments[0].findOne({
      where: arguments[1]
    });
  }
});

exports.updateOne = ash(async function(model, reqBody, id) {
  return await model.update(
    { ...reqBody },
    { where: id }
  );
});

exports.delete = ash(async function() {
  if (arguments.length > 1) {
    return await arguments[0].destroy({
      where: arguments[1]
    });
  }

  return await arguments[0].destroy({
    where: {},
    truncate: false
  });
});

exports.getUserRole = ash(async function(id, jti) {
  return await db.User.findOne({
    attributes: ['role'],
    where: {
      id: id,
      token: jti
    }
  });
});
