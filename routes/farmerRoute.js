const router = require('express').Router();
const farmerController = require('../controllers/farmerController');

// crud
router.post('/', farmerController.create);
router.get('/', farmerController.findAll);
router.get('/:id', farmerController.findOne);
router.put('/:id', farmerController.update);
router.delete('/', farmerController.deleteAll);
router.delete('/:id', farmerController.deleteOne);

module.exports = router;
