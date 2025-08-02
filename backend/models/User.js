const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  profilePic: { type: String, default: '' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  attendance: [{ type: Date }],
  feesPaid: { type: Boolean, default: false },
  joinDate: { type: Date, default: Date.now },
  plan: {
    name: { type: String },
    start: { type: Date },
    end: { type: Date }
  }
});

module.exports = mongoose.model('User', UserSchema);
