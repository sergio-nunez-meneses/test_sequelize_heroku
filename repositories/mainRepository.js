const db = require('../models/index');
const ash = require('express-async-handler');

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
