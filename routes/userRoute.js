const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/', userController.create);
router.put('/sign', userController.sign);

module.exports = router;
