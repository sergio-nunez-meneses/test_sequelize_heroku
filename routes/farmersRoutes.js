const router = require('express').Router();
const farmersController = require('../controllers/farmersController');

// crud
router.post('/', farmersController.create);
router.get('/', farmersController.findAll);
router.get('/:id', farmersController.findOne);
router.put('/:id', farmersController.update);
router.delete('/', farmersController.deleteAll);
router.delete('/:id', farmersController.deleteOne);

module.exports = router;
