const httpStatus = require('http-status');
const { Batch } = require('../models');
const ApiError = require('../utils/ApiError');

const createBatch = async (userBody) => {
  if (await Batch.isBatchExists(userBody.startYear)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Batch already exists');
  }
  return Batch.create(userBody);
};

const queryBatches = async (filter, options) => {
  const batches = await Batch.paginate(filter, options);
  return batches;
};

const getBatchById = async (id) => {
  return Batch.findById(id);
};

const getBatchByStartYear = async (startYear) => {
  return User.findOne({ startYear });
};

const updateBatchById = async (id, updateBody) => {
  const batch = await getBatchById(id);
  if (!batch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Batch not found');
  }
  Object.assign(batch, updateBody);
  await batch.save();
  return batch;
};

const deleteBatchById = async (batchId) => {
  const batch = await getBatchById(batchId);
  if (!batch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Batch not found');
  }
  await batch.remove();
  return batch;
};

module.exports = {
  createBatch,
  queryBatches,
  getBatchById,
  getBatchByStartYear,
  updateBatchById,
  deleteBatchById,
};
