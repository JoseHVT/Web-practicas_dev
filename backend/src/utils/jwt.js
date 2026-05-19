const jwt = require('jsonwebtoken');

const DEFAULT_JWT_SECRET = 'dev_jwt_secret_change_me';
const DEFAULT_EXPIRES_IN = '1h';

const getJwtSecret = () => process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

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
