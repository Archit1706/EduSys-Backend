const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const gradeSchema = mongoose.Schema({
  batch: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Batch',
    required: true,
  },
  subject: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Subject',
    required: true,
  },
  teacher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  output: [
    {
      title: String,
      uni: Number,
      pt: Number,
      direct: Number,
      indirect: Number,
      final: Number,
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'completed', 'inactive'],
    default: 'pending',
  },
  input: Object,
});

// add plugin that converts mongoose to json
gradeSchema.plugin(toJSON);
gradeSchema.plugin(paginate);

gradeSchema.statics.isGradeExists = async function (subject, batch) {
  const grade = await this.findOne({ subject, batch });
  return !!grade;
};

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
