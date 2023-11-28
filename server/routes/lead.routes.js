const router = require('express').Router();
const leadController = require('../controllers/lead.controller');
const AuthMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

// Configuring Multer
const upload = multer({
    storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    }),
});

// Middlewares
router.use(AuthMiddleware.isUserAuthenticated)
router.use(AuthMiddleware.isUserAdmin)

// Configuring routes
router.post('/createLead', leadController.createLead);
router.post('/uploadLeads', upload.single('file'), leadController.uploadLeads);
router.get('/getAllLeads', leadController.getAllLeads);
router.get('/getLeadsByPerson', leadController.getLeadsByPerson);
router.get('/getLeadsByCampaign', leadController.getLeadsByCampaign);
router.get('/getLeadsByStatus', leadController.getLeadsByStatus);
router.get('/getLeadsByCategory', leadController.getLeadsByCategory);
router.delete('/deleteLead', leadController.deleteLead);

// Exporting Router
module.exports = router;