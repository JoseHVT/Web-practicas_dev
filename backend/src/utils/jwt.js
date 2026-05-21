const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/env');

const DEFAULT_EXPIRES_IN = '1h';

const getJwtOptions = () => ({
  expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRES_IN
});

const createToken = (account) => jwt.sign(
  {
    sub: account._id.toString(),
    username: account.username,
    email: account.email
  },
  getJwtSecret(),
  getJwtOptions()
);

const verifyToken = (token) => jwt.verify(token, getJwtSecret());

module.exports = {
  createToken,
  verifyToken
};
