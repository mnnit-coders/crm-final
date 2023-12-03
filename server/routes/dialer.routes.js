const router = require('express').Router();
const dialerController = require('../controllers/dialer.controller');
const AuthMiddleware = require('../middlewares/authMiddleware');

// const AdminRouter = require('express').Router();
// AdminRouter.use(AuthMiddleware.isUserAuthenticated)
// AdminRouter.use(AuthMiddleware.isUserAdmin)
// AdminRouter.get('/list', dialerController.getDialers);

// // Middlewares
// router.use(AdminRouter)

router.use(AuthMiddleware.isUserAuthenticated)
router.use(AuthMiddleware.isUserDialer)

// Configuring routes
router.get('/getLeads', dialerController.getLeads);
router.post('/getcallrecord',dialerController.getCallRecord)

// Exporting Router
module.exports = router;