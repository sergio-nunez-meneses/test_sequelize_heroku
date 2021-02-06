const router = require('express').Router();
const farmerController = require('../controllers/farmerController');

router.post('/', farmerController.create);

module.exports = router;
