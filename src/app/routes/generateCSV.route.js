const express = require('express');

const router = express.Router();

const resultQueryController = require('../controllers/generateCSV.controller');

router.get('/', resultQueryController.generateAllDataCSV);


module.exports = router;