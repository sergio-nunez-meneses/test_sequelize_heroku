const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/', userController.create);
router.get('/', userController.findAll);
router.get('/:id', userController.findOne);
router.put('/signin', userController.signIn);
router.get('/signout', userController.signOut)

module.exports = router;
