const router = require('express').Router();
const usersController = require('../controllers/usersController');
const middleware = require('../middlewares/auth');

// access
router.put('/signin', usersController.signIn);
router.get('/signout', usersController.signOut);

// crud
router.post('/', usersController.create);
router.get('/', middleware.auth, usersController.findAll);
router.get('/:id', usersController.findOne);
router.put('/:id', usersController.update);
router.delete('/', usersController.deleteAll);
router.delete('/:id', usersController.deleteOne);

module.exports = router;
