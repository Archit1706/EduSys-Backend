const express = require('express');
const auth = require('../../middlewares/auth');
const subjectController = require('../../controllers/subject.controller');

const router = express.Router();

router.route('/').post(auth('manageBatches'), subjectController.createSubject).get(subjectController.getSubjects);

router
  .route('/:subjectId')
  .get(subjectController.getSubject)
  .patch(auth('manageBatches'), subjectController.updateSubject)
  .delete(auth('manageBatches'), subjectController.deleteSubject);

module.exports = router;
