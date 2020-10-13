const db = require('../../models/index');
const { Op } = require('sequelize');
const ash = require('express-async-handler');
const cors = require('cors');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

router.use(cors());

router.get('/', ash(async function(req, res, next) {
  const { farms } = req.query;
  const where = {};

  if (farms && farms !== '')
  {
    farms = farms.split(' ');

    where = {
      [Op.or]: []
    }

    for (let farm of farms)
    {
      where[Op.or].push({
        title: {
          [Op.substring]: farm
        }
      });
    }
  }

  const farmers = await db.Farm.findAll({ where: where });

  res.send(farmers);
}));

module.exports = router;
