const router = require('express').Router();
const usersController = require('../controllers/usersController');
const middleware = require('../middlewares/auth');

router.post('/', middleware.auth, usersController.create);
router.get('/', middleware.auth, usersController.findAll);
router.get('/:id', middleware.auth, usersController.findOne);
router.put('/:id', middleware.auth, usersController.update);
router.delete('/', middleware.auth, usersController.deleteAll);
router.delete('/:id', middleware.auth, usersController.deleteOne);

module.exports = router;
