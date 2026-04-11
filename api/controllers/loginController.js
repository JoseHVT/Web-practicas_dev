const LoginAccount = require('../models/LoginAccount');

// POST - Login (Autenticación)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    const account = await LoginAccount.findOne({ username, active: true });

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Comparar contraseña
    const isPasswordValid = await account.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        id: account._id,
        username: account.username,
        email: account.email
      },
      token: `token_${Date.now()}_${account._id}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el login',
      error: error.message
    });
  }
};

// POST - Registro
exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden'
      });
    }

    // Verificar si el usuario o email ya existe
    const existingUser = await LoginAccount.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El usuario o email ya existe'
      });
    }

    const newAccount = new LoginAccount({
      username,
      email,
      password
    });

    await newAccount.save();

    res.status(201).json({
      success: true,
      message: 'Registro exitoso',
      data: {
        id: newAccount._id,
        username: newAccount.username,
        email: newAccount.email
      }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el registro',
      error: error.message
    });
  }
};

// GET - Obtener todas las cuentas de login
exports.getLoginAccounts = async (req, res) => {
  try {
    const accounts = await LoginAccount.find({}, '-password');
    res.json({
      success: true,
      data: accounts.map(acc => ({
        id: acc._id,
        username: acc.username,
        email: acc.email,
        active: acc.active,
        createdAt: acc.createdAt
      })),
      count: accounts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener cuentas',
      error: error.message
    });
  }
};

// DELETE - Eliminar cuenta de login
exports.deleteLoginAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await LoginAccount.findByIdAndDelete(id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Cuenta no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Cuenta eliminada exitosamente',
      data: {
        id: account._id,
        username: account.username
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cuenta',
      error: error.message
    });
  }
};

// PUT - Actualizar contraseña
exports.updatePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    const account = await LoginAccount.findOne({ username });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Comparar contraseña antigua
    const isPasswordValid = await account.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña antigua incorrecta'
      });
    }

    account.password = newPassword;
    await account.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar contraseña',
      error: error.message
    });
  }
};
