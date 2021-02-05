const db = require('../../models/index');
const ash = require('express-async-handler');
const cors = require('cors');
const express = require('express');
const router = express.Router();

router.use(cors());

router.post('/:id', ash(async function(req, res, next) {
  if (req.params.id !== '') {
    await db.Farm.destroy({
      where:
        { id: req.params.id }
      });

    res.send({});
  }
}));

module.exports = router;
