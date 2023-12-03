const router = require('express').Router();
const campaignController = require('../controllers/campaign.controller.js');
const AuthMiddleware = require('../middlewares/authMiddleware.js');

// Middlewares
router.use(AuthMiddleware.isUserAuthenticated)
router.use(AuthMiddleware.isUserAdmin)
// Creating Routes
router.get('/list', campaignController.getCampaigns);
router.get("/listMembers/:campID", campaignController.getCampaignMembers);
router.get('/details/:campID', campaignController.getDetails);
router.post('/create', campaignController.createCampaign);
router.delete('/remove/:campID', campaignController.removeCampaign);
router.put('/update', campaignController.updateCampaign);


// Exporting Router
module.exports = router;