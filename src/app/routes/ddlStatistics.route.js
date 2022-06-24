const express = require('express');

const router = express.Router();

const resultQueryController = require('../controllers/events.controller');

router.get('/', resultQueryController.getAllEventsLogs);
router.get('/:databaseName', resultQueryController.getEventsLogsByDatabase);

module.exports = router;