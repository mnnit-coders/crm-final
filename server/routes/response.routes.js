const router = require("express").Router()
const ResponseController = require("../controllers/response.controller")
const AuthMiddleware = require("../middlewares/authMiddleware")

// Middleware
router.use(AuthMiddleware.isUserAuthenticated)
router.use(AuthMiddleware.isUserDialer)

// Configuring Routes
router.post('/create', ResponseController.createResponse)

// Exporting Router
module.exports = router