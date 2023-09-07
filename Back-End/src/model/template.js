
const mongoose = require('mongoose');


const templateSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
