const router = require('express').Router();
const farmController = require('../controllers/farmController');

// crud
router.post('/', farmController.create);
router.get('/', farmController.findAll);
router.get('/:id', farmController.findOne);
router.put('/:id', farmController.update);
router.delete('/', farmController.deleteAll);
router.delete('/:id', farmController.deleteOne);

module.exports = router;
