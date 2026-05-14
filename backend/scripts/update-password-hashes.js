const dotenv = require('dotenv');

dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const LoginAccount = require('../src/modules/auth/auth.model');
const { isCryptoHash } = require('../src/utils/passwordHash');

const LEGACY_HASH_PATTERN = /^\$2[aby]\$/;

const parsePasswordUpdates = () => {
  if (!process.env.PASSWORD_UPDATES) {
    return {};
  }

  try {
    return JSON.parse(process.env.PASSWORD_UPDATES);
  } catch (error) {
    throw new Error('PASSWORD_UPDATES must be valid JSON. Example: {"admin":"admin123"}');
  }
};

const updatePasswordHashes = async () => {
  const passwordUpdates = parsePasswordUpdates();
  const connected = await connectDB();

  if (!connected) {
    process.exitCode = 1;
    return;
  }

  const accounts = await LoginAccount.find();
  const result = {
    updated: 0,
    skippedCrypto: 0,
    skippedLegacyHash: 0
  };

  for (const account of accounts) {
    const replacementPassword = passwordUpdates[account.username];

    if (replacementPassword) {
      account.password = replacementPassword;
      await account.save();
      result.updated += 1;
      console.log(`Updated password hash for ${account.username}`);
      continue;
    }

    if (isCryptoHash(account.password)) {
      result.skippedCrypto += 1;
      continue;
    }

    if (LEGACY_HASH_PATTERN.test(account.password)) {
      result.skippedLegacyHash += 1;
      console.log(`Skipped ${account.username}: legacy hashes cannot be converted without the original password.`);
      continue;
    }

    account.markModified('password');
    await account.save();
    result.updated += 1;
    console.log(`Hashed plaintext password for ${account.username}`);
  }

  console.log('\nPassword hash update finished');
  console.log(result);
};

updatePasswordHashes()
  .catch((error) => {
    console.error('Password hash update failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
