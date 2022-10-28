const express = require('express');
const auth = require('../../middlewares/auth');
const gradeController = require('../../controllers/grade.controller');

const router = express.Router();

router.route('/').get(gradeController.getGrades);

router.route('/calculate').post(gradeController.calculateGrades);

router.route('/:gradeId').get(gradeController.getGrade).delete(auth('manageBatches'), gradeController.deleteGrade);

router.route('/assign').post(gradeController.assignSubject);

module.exports = router;
