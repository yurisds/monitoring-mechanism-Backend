const express = require('express');

const router = express.Router();

const eventsRoute = require('./app/routes/ddlStatistics.route');
const statisticsRoute = require('./app/routes/statistics.route');
const hoursRoute = require('./app/routes/hours.route');
const gradeRoute = require('./app/routes/grade.route');
const generateCSV = require('./app/routes/generateCSV.route');
const databaseUsers = require('./app/routes/databaseUsers.route');

router.get('/', (req, res) => {
    res.send(`API rodando em ${process.env.BASE_URL || 3003}`);
});

router.use('/events', eventsRoute);
router.use('/statistics', statisticsRoute);
router.use('/hours', hoursRoute);
router.use('/grade', gradeRoute);
router.use('/csv', generateCSV);
router.use('/databases', databaseUsers);

module.exports = router;
