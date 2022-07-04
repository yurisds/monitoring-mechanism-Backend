const express = require('express');

const router = express.Router();

const eventsRoute = require('./app/routes/ddlStatistics.route');
const statisticsRoute = require('./app/routes/statistics.route');
const hoursRoute = require('./app/routes/hours.route');
const gradeRoute = require('./app/routes/grade.route');

router.get('/', (req, res) => {
    res.send(`API rodando em ${process.env.BASE_URL || 3003}`);
});

router.use('/events', eventsRoute);
router.use('/statistics', statisticsRoute);
router.use('/hours', hoursRoute);
router.use('/grade', gradeRoute);

module.exports = router;
