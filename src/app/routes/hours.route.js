const express = require('express');

const router = express.Router();

const hoursController = require('../controllers/hours.controller');

router.get('/:databaseName', hoursController.getHoursIntervalsByDatabase);

module.exports = router;