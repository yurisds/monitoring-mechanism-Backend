const express = require('express');

const router = express.Router();

const resultQueryController = require('../controllers/databaseUsers.controller');

router.post('/', resultQueryController.addDatabases);
router.get('/', resultQueryController.getHashs);


module.exports = router;