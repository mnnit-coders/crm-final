const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');

const reportsController = require("../controllers/reports.controller")

// Middleware
router.use(authMiddleware.isUserAuthenticated)

// Configuring Routes
router.get("/campaignLeads/:id", reportsController.getCampaignStatistics)
router.get("/averateCallTime/:userId", reportsController.averageCallTime)
router.get("/campaignStats/:id", reportsController.getCampaignStatistics)

// Exporting Router
module.exports = router;