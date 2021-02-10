const router = require('express').Router();
const farmsController = require('../controllers/farmsController');

// crud
router.post('/', farmsController.create);
router.get('/', farmsController.findAll);
router.get('/:id', farmsController.findOne);
router.put('/:id', farmsController.update);
router.delete('/', farmsController.deleteAll);
router.delete('/:id', farmsController.deleteOne);

module.exports = router;
