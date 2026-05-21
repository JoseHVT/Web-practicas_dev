const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/login_db';
const DEFAULT_JWT_SECRET = 'dev_jwt_secret_change_me';
const DEFAULT_PASSWORD_PEPPER = 'web-practicas-dev-pepper';

const isProduction = process.env.NODE_ENV === 'production';

const getRequiredEnv = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`falta la variable de entorno ${name}`);
  }

  return value;
};

const getAllowedOrigins = () => {
  const rawOrigins = process.env.ALLOWED_ORIGIN || '';
  const origins = rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length > 0) {
    return origins;
  }

  if (isProduction) {
    throw new Error('falta la variable de entorno ALLOWED_ORIGIN');
  }

  return ['http://localhost:5173'];
};

const getMongoUri = () => (
  isProduction ? getRequiredEnv('MONGODB_URI') : process.env.MONGODB_URI || DEFAULT_MONGO_URI
);

const getJwtSecret = () => (
  isProduction ? getRequiredEnv('JWT_SECRET') : process.env.JWT_SECRET || DEFAULT_JWT_SECRET
);

const getPasswordPepper = () => (
  isProduction
    ? getRequiredEnv('PASSWORD_PEPPER')
    : process.env.PASSWORD_PEPPER || DEFAULT_PASSWORD_PEPPER
);

const validateRuntimeConfig = () => {
  getMongoUri();
  getJwtSecret();
  getPasswordPepper();
  getAllowedOrigins();
};

module.exports = {
  getAllowedOrigins,
  getJwtSecret,
  getMongoUri,
  getPasswordPepper,
  isProduction,
  validateRuntimeConfig
};
