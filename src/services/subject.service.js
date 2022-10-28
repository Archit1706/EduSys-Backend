const httpStatus = require('http-status');
const { Subject } = require('../models');
const ApiError = require('../utils/ApiError');

const makeArray = (a, b) => {
  var arr = new Array(a);
  for (var i = 0; i < a; i++) arr[i] = new Array(0, 0);
  return arr;
};

const calculateTarget = (attainment) => {
  const temp = makeArray(16, 2); // 2 each 0-sum, 1-count
  console.log(temp);
  const titles = [];
  attainment.forEach((item) => {
    item.data.forEach((data, idx) => {
      titles.push(data.title);
      if (data.value !== null) {
        temp[idx][0] += Number(data.value);
        temp[idx][1] += 1;
      }
    });
  });
  console.log(temp);
  const target = {};
  temp.forEach((item, idx) => {
    target[titles[idx]] = item[0] / item[1];
  });
  console.log(target);
  return target;
};

const createSubject = async (userBody) => {
  if (await Subject.isSubjectExists(userBody.subjectCode)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Subject already exists');
  }
  const target = calculateTarget(userBody.attainment);
  userBody.target = target;
  console.log(userBody);
  return Subject.create(userBody);
};

const querySubjects = async (filter, options) => {
  const res = await Subject.paginate(filter, options);
  return res;
};

const getSubjectById = async (id) => {
  return Subject.findById(id);
};

const updateSubjectById = async (id, updateBody) => {
  const subject = await getSubjectById(id);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  Object.assign(subject, updateBody);
  await subject.save();
  return subject;
};

const deleteSubjectById = async (id) => {
  const subject = await getSubjectById(id);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }
  await subject.remove();
  return subject;
};

module.exports = {
  createSubject,
  querySubjects,
  getSubjectById,
  updateSubjectById,
  deleteSubjectById,
};
