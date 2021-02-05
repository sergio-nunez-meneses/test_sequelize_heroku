const db = require('../../models/index');
const { Op } = require('sequelize');
const ash = require('express-async-handler');
const cors = require('cors');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

router.use(cors());

router.get('/', ash(async function(req, res, next) {
  let values = req.query.name;
  let query = {};

  if (values && values !== '') {
    query = {
      [Op.or]: []
    }

    values = values.split(' ');

    for (let value of values) {
      query[Op.or].push({
        name: {
          [Op.substring]: value
        }
      });
    }

    const farmers = await db.Farm.findAll({ where: query });
    res.send(farmers);
  }
}));

module.exports = router;
