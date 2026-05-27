const mongoose = require('mongoose');
const {
  hashPassword,
  isCryptoHash,
  verifyPassword
} = require('../../utils/passwordHash');
const { MIN_PASSWORD_LENGTH } = require('../../utils/passwordRules');

const loginAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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
    minlength: MIN_PASSWORD_LENGTH
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

// hash password before saving it in mongodb
loginAccountSchema.pre('save', function() {
  if (!this.isModified('password')) {
    return;
  }

  if (isCryptoHash(this.password)) {
    return;
  }

  this.password = hashPassword(this.password);
});

// compare received password against the stored crypto hash
loginAccountSchema.methods.comparePassword = function(passwordIngresada) {
  return verifyPassword(passwordIngresada, this.password);
};

module.exports = mongoose.model('LoginAccount', loginAccountSchema);
