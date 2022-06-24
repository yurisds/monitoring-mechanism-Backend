const express = require('express');

const router = express.Router();

const resultQueryController = require('../controllers/statistics.controller');

router.get('/', resultQueryController.getAllStatistics);
router.get('/:databaseName', resultQueryController.getStatisticsByDatabase);

module.exports = router;