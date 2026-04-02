const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  note: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Savings', savingsSchema);