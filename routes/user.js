const router = require('express').Router();
const users = require('../controllers/users');

// access
router.put('/signin', users.signIn);
router.get('/signout', users.signOut);

// crud
router.post('/', users.create);
router.get('/', users.findAll);
router.get('/:id', users.findOne);
router.put('/:id', users.update);
router.delete('/', users.deleteAll);
router.delete('/:id', users.deleteOne);

module.exports = router;
