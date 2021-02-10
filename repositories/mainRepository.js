const db = require('../models/index');
const ash = require('express-async-handler');

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
