const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const subjectSchema = mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['Theory', 'Lab'],
    default: 'Theory',
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  target: Object,
  attainment: {
    type: [
      {
        co: String,
        description: String,
        data: [
          {
            title: String,
            value: Number,
          },
        ],
      },
    ],
    required: true,
  },
});

// add plugin that converts mongoose to json
subjectSchema.plugin(toJSON);
subjectSchema.plugin(paginate);

subjectSchema.statics.isSubjectExists = async function (subjectCode) {
  const batch = await this.findOne({ subjectCode });
  return !!batch;
};

/**
 * @typedef Token
 */
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
