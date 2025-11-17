const mongoose = require('mongoose');

const wordBankSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  keywords: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('WordBank', wordBankSchema);
