const router = require('express').Router();
const farms = require('../controllers/farms');

// crud
router.post('/', farms.create);
router.get('/', farms.findAll);
router.get('/:id', farms.findOne);
router.put('/:id', farms.update);
router.delete('/', farms.deleteAll);
router.delete('/:id', farms.deleteOne);

module.exports = router;
