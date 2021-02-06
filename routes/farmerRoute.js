const router = require('express').Router();
const farmerController = require('../controllers/farmerController');

router.post('/', farmerController.create);
router.get('/', farmerController.findAll);
router.get('/:id', farmerController.findOne);
router.put('/:id', farmerController.update);
router.delete('/:id', farmerController.delete);

module.exports = router;
