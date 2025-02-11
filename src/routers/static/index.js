const express = require('express');
const router = express.Router();
const static = require('../../services/static.service')
const statisticsController = require('../../controllers/staticcontroller');
router.post('/save', statisticsController.saveStatistics);
// router.get('/preview', statisticsController.previewStatistics);
router.get('/', statisticsController.getStatistics);
router.delete('/:id', statisticsController.deleteStatisticsById)
router.delete('/' , statisticsController.deleteAllStatistics)
module.exports = router;

