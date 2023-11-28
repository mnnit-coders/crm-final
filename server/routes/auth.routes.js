const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/ownerRegister', authController.ownerRegister)
router.post('/login', authController.login)
router.post('/verifyUser',authController.verifyUser)
router.post('/register', authController.register)
router.delete('/unregister', authController.unregister)
router.post('/refresh', authController.refresh)
router.use(authMiddleware.isUserAuthenticated)
router.delete('/logout', authController.logout)
// router.use(authMiddleware.isUserOwner)

module.exports = router;