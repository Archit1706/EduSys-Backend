const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { batchService } = require('../services');

const createBatch = catchAsync(async (req, res) => {
  const batch = await batchService.createBatch(req.body);
  res.status(httpStatus.CREATED).send(batch);
});

const getBatches = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['startYear', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = '-endYear';
  const result = await batchService.queryBatches(filter, options);
  res.send(result);
});

const getBatch = catchAsync(async (req, res) => {
  const batch = await batchService.getBatchById(req.params.batchId);
  if (!batch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'batch not found');
  }
  res.send(batch);
});

const updateBatch = catchAsync(async (req, res) => {
  const batch = await batchService.updateBatchById(req.params.batchId, req.body);
  res.send(batch);
});

const deleteBatch = catchAsync(async (req, res) => {
  await batchService.deleteBatchById(req.params.batchId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBatch,
  getBatches,
  getBatch,
  updateBatch,
  deleteBatch,
};
