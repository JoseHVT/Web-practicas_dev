const dotenv = require('dotenv');

dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/modules/users/user.model');
const LoginAccount = require('../src/modules/auth/auth.model');

const getOption = (name, fallbackValue) => {
  const prefix = `--${name}=`;
  const option = process.argv.find((value) => value.startsWith(prefix));

  return option ? option.slice(prefix.length) : fallbackValue;
};

const DEMO_ADMIN = {
  username: getOption('username', 'tequi'),
  email: getOption('email', 't@gmail.com'),
  password: getOption('password', '123456'),
  role: getOption('role', 'admin')
};

const ensureDemoAdmin = async () => {
  const connected = await connectDB();

  if (!connected) {
    process.exitCode = 1;
    return;
  }

  let user = await User.findOne({ email: DEMO_ADMIN.email });

  if (!user) {
    user = new User({
      name: DEMO_ADMIN.username,
      email: DEMO_ADMIN.email,
      role: DEMO_ADMIN.role
    });
  } else {
    user.name = DEMO_ADMIN.username;
    user.email = DEMO_ADMIN.email;
    user.role = DEMO_ADMIN.role;
  }

  await user.save();

  let account = await LoginAccount.findOne({
    $or: [
      { username: DEMO_ADMIN.username },
      { email: DEMO_ADMIN.email }
    ]
  });

  if (!account) {
    account = new LoginAccount({
      user: user._id,
      username: DEMO_ADMIN.username,
      email: DEMO_ADMIN.email,
      password: DEMO_ADMIN.password,
      active: true
    });
  } else {
    account.user = user._id;
    account.username = DEMO_ADMIN.username;
    account.email = DEMO_ADMIN.email;
    account.password = DEMO_ADMIN.password;
    account.active = true;
  }

  await account.save();

  console.log('cuenta admin lista');
  console.log(`usuario: ${DEMO_ADMIN.username}`);
  console.log(`email: ${DEMO_ADMIN.email}`);
  console.log(`contrasena: ${DEMO_ADMIN.password}`);
};

ensureDemoAdmin()
  .catch((error) => {
    console.error('no se pudo crear la cuenta admin:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
