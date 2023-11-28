const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');


// Configuring Index router

// GENERAL AUTHENTICATION (Handling of Logins and Token Management)
router.use('/auth', require('./auth.routes'))
// router.use(authMiddleware.isUserAuthenticated) // Middleware for authenticating all routes below

// OWNER LAYER (Organization Management)
router.use('/org', require('./org.routes'))

// ADMIN LAYER (Dialer and Leads Management)
router.use('/campaign', require('./campaign.routes'))
router.use('/lead', require('./lead.routes'))

// DIALER LAYER (Handling of Leads and Responses - Employees)

// TESTING LAYER (Routes under testing)
router.use('/dialer', require('./dialer.routes'))   
router.use('/responses', require('./response.routes'))
router.use('/reports', require('./reports.routes'))

// Exporting Router
module.exports = router