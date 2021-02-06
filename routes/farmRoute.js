const router = require('express').Router();
const farmController = require('../controllers/farmController');

router.post('/', farmController.create);

module.exports = router;
