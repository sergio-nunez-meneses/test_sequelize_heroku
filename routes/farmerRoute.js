const router = require('express').Router();
const farmerController = require('../controllers/farmerController');

router.post('/', farmerController.create);
router.get('/', farmerController.findAll);

module.exports = router;
