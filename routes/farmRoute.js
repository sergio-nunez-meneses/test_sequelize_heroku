const router = require('express').Router();
const farmController = require('../controllers/farmController');

router.post('/', farmController.create);
router.get('/', farmController.findAll);
router.get('/:id', farmController.findOne);

module.exports = router;
