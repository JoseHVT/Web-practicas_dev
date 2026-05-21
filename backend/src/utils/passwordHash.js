const crypto = require('crypto');
const { getPasswordPepper } = require('../config/env');

const HASH_ALGORITHM = 'scrypt';
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const SCRYPT_OPTIONS = Object.freeze({
  N: 16384,
  r: 8,
  p: 1
});

const passwordWithPepper = (password) => {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password must be a non-empty string');
  }

  return `${password}:${getPasswordPepper()}`;
};

const createSalt = () => crypto.randomBytes(SALT_LENGTH).toString('hex');

const runScrypt = (password, salt, options = SCRYPT_OPTIONS, keyLength = KEY_LENGTH) => (
  crypto.scryptSync(passwordWithPepper(password), salt, keyLength, options)
);

const isCryptoHash = (value) => (
  typeof value === 'string' && value.startsWith(`${HASH_ALGORITHM}$`)
);

const hashPassword = (password, salt = createSalt()) => {
  const hash = runScrypt(password, salt).toString('hex');

  return [
    HASH_ALGORITHM,
    SCRYPT_OPTIONS.N,
    SCRYPT_OPTIONS.r,
    SCRYPT_OPTIONS.p,
    salt,
    hash
  ].join('$');
};

const hashTextForDemo = (text, salt = 'practica-hash-salt') => (
  runScrypt(text, salt).toString('hex')
);

const verifyPassword = (password, storedHash) => {
  if (!isCryptoHash(storedHash)) {
    return false;
  }

  const [algorithm, n, r, p, salt, hash] = storedHash.split('$');
  const options = {
    N: Number(n),
    r: Number(r),
    p: Number(p)
  };

  if (
    algorithm !== HASH_ALGORITHM ||
    !salt ||
    !hash ||
    Object.values(options).some(Number.isNaN)
  ) {
    return false;
  }

  const expected = Buffer.from(hash, 'hex');
  if (expected.length === 0) {
    return false;
  }

  const candidate = runScrypt(password, salt, options, expected.length);

  return expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate);
};

module.exports = {
  hashPassword,
  hashTextForDemo,
  isCryptoHash,
  verifyPassword
};
