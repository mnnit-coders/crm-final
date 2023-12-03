const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/authMiddleware')
const orgController = require('../controllers/org.controller')

const adminRouter = express.Router()

// Configuring Router
router.use(authMiddleware.isUserAuthenticated)

// Admin Routes
adminRouter.use(authMiddleware.isUserAdmin)
router.get('/getDialers', orgController.getDialers)
router.use(adminRouter)

// Owner Routes
router.use(authMiddleware.isUserAdminorOwner)
router.post("/setSettings", orgController.setOrgSettings)

router.use(authMiddleware.isUserOwner)

router.get('/orgs', orgController.getAllOrgs)
router.post('/addOrg', orgController.addOrg)
router.delete('/removeOrg', orgController.removeOrg)
router.put('/updateSubscription', orgController.updateSubscription)
router.put('/changePassword', orgController.changePassword)

// Exporting Router
module.exports = router