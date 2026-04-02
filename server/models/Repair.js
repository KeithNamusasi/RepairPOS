const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  device: {
    type: String,
    required: true,
    trim: true
  },
  problemDescription: {
    type: String,
    required: true,
    trim: true
  },
  repairCost: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'In Repair', 'Completed', 'Collected'],
    default: 'Pending'
  },
  dateReceived: {
    type: Date,
    default: Date.now
  },
  dateCompleted: {
    type: Date
  }
});

module.exports = mongoose.model('Repair', repairSchema);