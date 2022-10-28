const express = require('express');
const auth = require('../../middlewares/auth');
const batchController = require('../../controllers/batch.controller');

const router = express.Router();

router.route('/').post(auth('manageBatches'), batchController.createBatch).get(batchController.getBatches);

router
  .route('/:batchId')
  .get(batchController.getBatch)
  .patch(auth('manageBatches'), batchController.updateBatch)
  .delete(auth('manageBatches'), batchController.deleteBatch);

module.exports = router;
