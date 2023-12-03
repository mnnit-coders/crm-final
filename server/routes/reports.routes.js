const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');

const reportsController = require("../controllers/reports.controller")

// Middleware
router.use(authMiddleware.isUserAuthenticated)

// Configuring Routes
router.get("/campaignLeads/:id", reportsController.getCampaignStatistics)
router.get("/averateCallTime/:userId", reportsController.averageCallTime)
router.get("/campaignStats/:id", reportsController.getCampaignStatistics)
router.get("/orgStats", authMiddleware.isUserAuthenticated,authMiddleware.isUserAdmin,reportsController.getOrgStatistics)
router.get("/dialersStats/:id", reportsController.generateReportsForUsers)
router.post('/loginstats',reportsController.getLoginReport)
router.post('/callstats',reportsController.getCallReport)
router.use(authMiddleware.isUserAdmin)
router.post('/userreport',reportsController.generateCallReportForAdmin)
router.post('/loginreport',reportsController.getLoginReportForAdmin)
router.post('/campaignreport',reportsController.getCampaignReport)
router.get('/adminreport',reportsController.getAdminReport)
// Exporting Router
module.exports = router;