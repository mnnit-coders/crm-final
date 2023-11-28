const router = require('express').Router();
const queriesController = require('../controllers/queries.controller');

router.get('/all', queriesController.getAllQueries)
// router.get('/one', queriesController.getOneQuery)
router.post('/new', queriesController.newQuery)
// router.put('/update', queriesController.updateQuery)
router.delete('/delete', queriesController.deleteQuery)

module.exports = router;