const router = require('express').Router();
const farmers = require('../controllers/farmers');

// crud
router.post('/', farmers.create);
router.get('/', farmers.findAll);
router.get('/:id', farmers.findOne);
router.put('/:id', farmers.update);
router.delete('/', farmers.deleteAll);
router.delete('/:id', farmers.deleteOne);

module.exports = router;
