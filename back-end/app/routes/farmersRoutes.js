const router = require('express').Router();
const farmersController = require('../controllers/farmersController');
const middleware = require('../middlewares/auth');

router.post('/', middleware.auth, farmersController.create);
router.get('/', middleware.auth, farmersController.findAll);
router.get('/:id', middleware.auth, farmersController.findOne);
router.put('/:id', middleware.auth, farmersController.update);
router.delete('/', middleware.auth, farmersController.deleteAll);
router.delete('/:id', middleware.auth, farmersController.deleteOne);

module.exports = router;
