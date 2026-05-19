const User = require('./user.model');
const LoginAccount = require('../auth/auth.model');

const normalizeName = (value) => (
  typeof value === 'string' ? value.trim() : value
);

const normalizeEmail = (value) => (
  typeof value === 'string' ? value.trim().toLowerCase() : value
);

const isDuplicateKeyError = (error) => error?.code === 11000;

const isValidPassword = (password) => (
  typeof password === 'string' &&
  password.length >= 6 &&
  !/\s/.test(password)
);

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error al obtener usuarios',
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'usuario no encontrado'
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error al obtener usuario',
      error: error.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const normalizedName = normalizeName(name);
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'nombre, email y contrasena son requeridos'
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'contrasena invalida'
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    const existingAccount = await LoginAccount.findOne({
      $or: [{ username: normalizedName }, { email: normalizedEmail }]
    });

    if (existingUser || existingAccount) {
      return res.status(409).json({
        success: false,
        message: 'el usuario o email ya existe'
      });
    }

    const newUser = new User({
      name: normalizedName,
      email: normalizedEmail,
      role: role || 'user'
    });

    try {
      await newUser.save();
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return res.status(409).json({
          success: false,
          message: 'el usuario o email ya existe'
        });
      }

      throw error;
    }

    const newAccount = new LoginAccount({
      user: newUser._id,
      username: normalizedName,
      email: normalizedEmail,
      password
    });

    try {
      await newAccount.save();
    } catch (error) {
      await User.findByIdAndDelete(newUser._id);

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
      message: 'usuario creado exitosamente',
      data: newUser
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error al crear usuario',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'usuario no encontrado'
      });
    }

    const linkedAccount = await LoginAccount.findOne({ user: user._id });
    const normalizedName = normalizeName(name);
    const normalizedEmail = normalizeEmail(email);

    if (normalizedEmail && normalizedEmail !== user.email) {
      const userConflict = await User.findOne({
        _id: { $ne: user._id },
        email: normalizedEmail
      });

      const accountConflict = linkedAccount
        ? await LoginAccount.findOne({
          _id: { $ne: linkedAccount._id },
          email: normalizedEmail
        })
        : null;

      if (userConflict || accountConflict) {
        return res.status(409).json({
          success: false,
          message: 'el usuario o email ya existe'
        });
      }
    }

    if (normalizedName && linkedAccount && normalizedName !== linkedAccount.username) {
      const accountConflict = await LoginAccount.findOne({
        _id: { $ne: linkedAccount._id },
        username: normalizedName
      });

      if (accountConflict) {
        return res.status(409).json({
          success: false,
          message: 'el usuario o email ya existe'
        });
      }
    }

    if (normalizedName) user.name = normalizedName;
    if (normalizedEmail) user.email = normalizedEmail;
    if (role) user.role = role;

    await user.save();

    if (linkedAccount) {
      if (normalizedName) linkedAccount.username = normalizedName;
      if (normalizedEmail) linkedAccount.email = normalizedEmail;
      await linkedAccount.save();
    }

    return res.json({
      success: true,
      message: 'usuario actualizado exitosamente',
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error al actualizar usuario',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'usuario no encontrado'
      });
    }

    await LoginAccount.findOneAndDelete({ user: user._id });
    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'usuario eliminado exitosamente',
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error al eliminar usuario',
      error: error.message
    });
  }
};
