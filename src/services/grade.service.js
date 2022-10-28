const httpStatus = require('http-status');
const { Grade } = require('../models');
const ApiError = require('../utils/ApiError');

const createOrUpdateGrade = async (userBody) => {
  if (await Grade.isGradeExists(userBody.subject, userBody.batch)) {
    const grade = await Grade.findOne({ subject: userBody.subject, batch: userBody.batch });
    return updateGradeById(grade.id, userBody);
  } else return Grade.create(userBody);
};

const queryGrades = async (filter, options) => {
  const res = await Grade.paginate(filter, options);
  return res;
};

const getGradeById = async (id) => {
  return Grade.findById(id).populate('subject').populate('batch').populate('teacher');
};

const updateGradeById = async (id, updateBody) => {
  const grade = await getGradeById(id);
  if (!grade) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Grade not found');
  }
  Object.assign(grade, updateBody);
  await grade.save();
  return grade;
};

const deleteGradeById = async (id) => {
  const grade = await getGradeById(id);
  if (!grade) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Grade not found');
  }
  await grade.remove();
  return grade;
};

module.exports = {
  createOrUpdateGrade,
  queryGrades,
  getGradeById,
  updateGradeById,
  deleteGradeById,
};
