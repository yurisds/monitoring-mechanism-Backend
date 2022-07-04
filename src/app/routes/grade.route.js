const express = require('express');

const router = express.Router();

const GradeController = require('../controllers/grade.controller');

router.get('/', GradeController.getAllGrade);
router.get('/:dbUser', GradeController.getGradeByUser);

module.exports = router;