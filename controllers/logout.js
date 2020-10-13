const db = require('../models/index');
const { Op } = require('sequelize');

exports.logout = async function(req, res, next) {
  try {
    const user = await db.User.findOne({
      where: {
        token: {
          [Op.substring]: req.session.id
        }
      }
    });

    if (user) {
      const token = JSON.parse(user.dataValues.token);
      delete token[req.session.id];

      // insert empty curly brackets in the token column
      user.token = JSON.stringify(token);
      await user.save();
    }

    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
}
