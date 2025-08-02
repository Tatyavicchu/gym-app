const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // format: YYYY-MM-DD
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
