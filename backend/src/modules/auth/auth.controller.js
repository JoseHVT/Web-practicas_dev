const LoginAccount = require('./auth.model');
const User = require('../users/user.model');
const { createToken } = require('../../utils/jwt');
const { isValidPasswordInput } = require('../../utils/passwordRules');

const normalizeUsername = (value) => (
  typeof value === 'string' ? value.trim() : value
);

const normalizeEmail = (value) => (
  typeof value === 'string' ? value.trim().toLowerCase() : value
);

const isDuplicateKeyError = (error) => error?.code === 11000;

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const normalizedUsername = normalizeUsername(username);

    if (!normalizedUsername || !password) {
      return res.status(400).json({
        success: false,
        message: 'usuario y contrasena son requeridos'
      });
    }

    if (!isValidPasswordInput(password)) {
      return res.status(400).json({
        success: false,
        message: 'contrasena invalida'
      });
    }

    const account = await LoginAccount.findOne({
      username: normalizedUsername,
      active: true
    }).populate('user', 'role');

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'credenciales invalidas'
      });
    }

    const isPasswordValid = await account.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'credenciales invalidas'
      });
    }

    const token = createToken(account);

    return res.json({
      success: true,
      message: 'login exitoso',
      data: {
        id: account._id,
        userId: account.user?._id || account.user,
        username: account.username,
        email: account.email,
        role: account.user?.role || 'user'
      },
      token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error en el login',
      error: error.message
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedUsername || !normalizedEmail || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'todos los campos son requeridos'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'las contrasenas no coinciden'
      });
    }

    if (!isValidPasswordInput(password)) {
      return res.status(400).json({
        success: false,
        message: 'contrasena invalida'
      });
    }

    const existingAccount = await LoginAccount.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }]
    });

    if (existingAccount) {
      return res.status(409).json({
        success: false,
        message: 'el usuario o email ya existe'
      });
    }

    let user = await User.findOne({ email: normalizedEmail });
    let createdUser = false;

    if (!user) {
      try {
        user = new User({
          name: normalizedUsername,
          email: normalizedEmail,
          role: 'user'
        });

        await user.save();
        createdUser = true;
      } catch (error) {
        if (!isDuplicateKeyError(error)) {
          throw error;
        }

        user = await User.findOne({ email: normalizedEmail });

        if (!user) {
          throw error;
        }
      }
    }

    const newAccount = new LoginAccount({
      user: user._id,
      username: normalizedUsername,
      email: normalizedEmail,
      password
    });

    try {
      await newAccount.save();
    } catch (error) {
      if (createdUser) {
        await User.findByIdAndDelete(user._id);
      }

      if (isDuplicateKeyError(error)) {
        return res.status(409).json({
          success: false,
          message: 'el usuario o email ya existe'
        });
      }

      throw error;
    }

    return res.status(201).json({
      success: true,
      message: 'registro exitoso',
      data: {
        id: newAccount._id,
        userId: user._id,
        username: newAccount.username,
        email: newAccount.email
      }
    });
  } catch (error) {
    console.error('error en registro:', error);
    return res.status(500).json({
      success: false,
      message: 'error en el registro',
      error: error.message
    });
  }
};

exports.getLoginAccounts = async (req, res) => {
  try {
    const accounts = await LoginAccount.find({}, '-password');

    return res.json({
      success: true,
      data: accounts.map((account) => ({
        id: account._id,
        userId: account.user,
        username: account.username,
        email: account.email,
        active: account.active,
        createdAt: account.createdAt
      })),
      count: accounts.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error al obtener cuentas',
      error: error.message
    });
  }
};

exports.deleteLoginAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await LoginAccount.findByIdAndDelete(id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'cuenta no encontrada'
      });
    }

    const userId = account.user?._id || account.user;

    if (userId) {
      await User.findByIdAndDelete(userId);
    }

    return res.json({
      success: true,
      message: 'cuenta eliminada exitosamente',
      data: {
        id: account._id,
        username: account.username
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error al eliminar cuenta',
      error: error.message
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    const normalizedUsername = normalizeUsername(username);

    if (!normalizedUsername || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'todos los campos son requeridos'
      });
    }

    const account = await LoginAccount.findOne({
      username: normalizedUsername,
      active: true
    });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'usuario no encontrado'
      });
    }

    if (req.account?._id.toString() !== account._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'no puedes cambiar la contrasena de otra cuenta'
      });
    }

    if (!isValidPasswordInput(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'contrasena invalida'
      });
    }

    const isPasswordValid = await account.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'contrasena anterior incorrecta'
      });
    }

    account.password = newPassword;
    await account.save();

    return res.json({
      success: true,
      message: 'contrasena actualizada exitosamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error al actualizar contrasena',
      error: error.message
    });
  }
};
