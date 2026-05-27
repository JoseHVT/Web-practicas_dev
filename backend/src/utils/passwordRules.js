const MIN_PASSWORD_LENGTH = 4;

const isValidPasswordInput = (password) => (
  typeof password === 'string' &&
  password.length >= MIN_PASSWORD_LENGTH &&
  !/\s/.test(password)
);

module.exports = {
  MIN_PASSWORD_LENGTH,
  isValidPasswordInput
};
