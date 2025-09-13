const mongoose = require('mongoose');
const crypto = require('crypto');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Index for automatic expiry
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Generate OTP
otpSchema.statics.generateOTP = function() {
  return crypto.randomInt(100000, 999999).toString();
};

module.exports = mongoose.model('OTP', otpSchema);
