const mongoose = require('mongoose');
const {
  hashPassword,
  isCryptoHash,
  verifyPassword
} = require('../../utils/passwordHash');

const loginAccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving it in MongoDB.
loginAccountSchema.pre('save', function() {
  if (!this.isModified('password')) {
    return;
  }

  if (isCryptoHash(this.password)) {
    return;
  }

  this.password = hashPassword(this.password);
});

// Compare received password against the stored crypto hash.
loginAccountSchema.methods.comparePassword = function(passwordIngresada) {
  return verifyPassword(passwordIngresada, this.password);
};

module.exports = mongoose.model('LoginAccount', loginAccountSchema);
