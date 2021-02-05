const db = require('../../models/index');
const ash = require('express-async-handler');
const cors = require('cors');
const express = require('express');
const router = express.Router();

router.use(cors());

router.post('/:id', ash(async function(req, res, next) {
  if (req.body !== '') {
    const farmer = await db.Farm.update(
      { ...req.body },
      { where:
        { id: req.params.id }
      }
    );

    res.send({});
  }
}));

module.exports = router;
