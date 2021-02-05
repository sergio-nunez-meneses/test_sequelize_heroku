const db = require('../../models/index');
const ash = require('express-async-handler');
const cors = require('cors');
const express = require('express');
const router = express.Router();

router.use(cors());

router.post('/', ash(async function(req, res, next) {
  if (req.body !== '') {
    const newFarmer = await db.Farm.create({ ...req.body });

    res.send({ message: 'Farmer inserted successfully' });
  }
}));

module.exports = router;
