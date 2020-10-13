const db = require('../../models/index');
const cors = require('cors');
const ash = require('express-async-handler');
const express = require('express');
const router = express.Router();

router.use(cors());

router.get('/', ash(async function(req, res, next) {
  const farmers = await db.Farm.findAll();
  res.send({
    farmers: farmers,
    id: req.session.id
  });

  console.error(error);
}));

module.exports = router;
