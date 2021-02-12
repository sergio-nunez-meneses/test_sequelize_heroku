const router = require('express').Router();
const farmsController = require('../controllers/farmsController');
const middleware = require('../middlewares/auth');

// crud
router.post('/', middleware.auth, farmsController.create);
router.get('/', middleware.auth, farmsController.findAll);
router.get('/:id', middleware.auth, farmsController.findOne);
router.put('/:id', middleware.auth, farmsController.update);
router.delete('/', middleware.auth, farmsController.deleteAll);
router.delete('/:id', middleware.auth, farmsController.deleteOne);

module.exports = router;
