const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { gradeService, subjectService, userService } = require('../services');
const { calculate } = require('../utils/gradeCalculator');
const { Grade } = require('../models');

const calculateGrades = catchAsync(async (req, res) => {
  const subjectId = req.body.subject;
  const batchId = req.body.batch;
  const teacherId = req.body.teacher;
  const subject = await subjectService.getSubjectById(subjectId);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  const options = pick(req.body, ['uni', 'pt', 'indirect']);
  console.log(options);
  const output = calculate(subject.attainment, options);
  const grade = {
    batch: batchId,
    subject: subjectId,
    teacher: teacherId,
    output: output,
    status: 'completed',
    input: options,
  };
  const teacher = await userService.getUserById(req.body.teacher);
  if (teacher && subject && !teacher.subjects.includes(subject.subjectCode)) {
    teacher.subjects.push(subject.subjectCode);
    await teacher.save();
  }
  const result = await gradeService.createOrUpdateGrade(grade);
  res.status(httpStatus.CREATED).send(result);
});

const getGrades = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['batch', 'subject', 'teacher', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = 'batch, subject, teacher';
  // options.select = '-output';
  const result = await gradeService.queryGrades(filter, options);
  res.send(result);
});

const getGrade = catchAsync(async (req, res) => {
  const batch = await gradeService.getGradeById(req.params.gradeId);
  if (!batch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'batch not found');
  }
  res.send(batch);
});

const deleteGrade = catchAsync(async (req, res) => {
  await gradeService.deleteGradeById(req.params.gradeId);
  res.status(httpStatus.NO_CONTENT).send();
});

const assignSubject = catchAsync(async (req, res) => {
  const x = await Grade.find({ subject: req.body.subject, batch: req.body.batch });
  if (x.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Subject And Batch already assigned');
  }
  const teacher = await userService.getUserById(req.body.teacher);
  const subject = await subjectService.getSubjectById(req.body.subject);
  if (teacher && subject && !teacher.subjects.includes(subject.subjectCode)) {
    teacher.subjects.push(subject.subjectCode);
    await teacher.save();
  }
  const grade = await gradeService.createOrUpdateGrade(req.body);
  res.status(httpStatus.CREATED).send(grade);
});

module.exports = {
  calculateGrades,
  getGrades,
  getGrade,
  deleteGrade,
  assignSubject,
};
