const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const batchSchema = mongoose.Schema({
  startYear: {
    type: Number,
    required: true,
  },
  endYear: {
    type: Number,
    required: true,
  },
  batchCode: {
    type: String,
    required: true,
  },
  isActive: {
    type: Number,
    default: true,
  },
});

// add plugin that converts mongoose to json
batchSchema.plugin(toJSON);
batchSchema.plugin(paginate);

batchSchema.statics.isBatchExists = async function (startYear) {
  const batch = await this.findOne({ startYear });
  return !!batch;
};

/**
 * @typedef Token
 */
const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;
