// Base de datos simulada de cuentas de login
let loginAccounts = [
  { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123', active: true },
  { id: 2, username: 'user', email: 'user@example.com', password: 'user123', active: true }
];

let nextId = 3;

// POST - Login (Autenticación)
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Usuario y contraseña son requeridos'
    });
  }

  const account = loginAccounts.find(
    acc => acc.username === username && acc.password === password && acc.active
  );

  if (!account) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }

  res.json({
    success: true,
    message: 'Login exitoso',
    data: {
      id: account.id,
      username: account.username,
      email: account.email
    },
    token: `token_${Date.now()}` // Token simulado
  });
};

// POST - Registro
exports.register = (req, res) => {
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

  const existingUser = loginAccounts.find(
    acc => acc.username === username || acc.email === email
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'El usuario o email ya existe'
    });
  }

  const newAccount = {
    id: nextId++,
    username,
    email,
    password,
    active: true
  };

  loginAccounts.push(newAccount);

  res.status(201).json({
    success: true,
    message: 'Registro exitoso',
    data: {
      id: newAccount.id,
      username: newAccount.username,
      email: newAccount.email
    }
  });
};

// GET - Obtener todas las cuentas de login
exports.getLoginAccounts = (req, res) => {
  res.json({
    success: true,
    data: loginAccounts.map(acc => ({
      id: acc.id,
      username: acc.username,
      email: acc.email,
      active: acc.active
    })),
    count: loginAccounts.length
  });
};

// DELETE - Eliminar cuenta de login
exports.deleteLoginAccount = (req, res) => {
  const { id } = req.params;
  const accountIndex = loginAccounts.findIndex(acc => acc.id === parseInt(id));

  if (accountIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Cuenta no encontrada'
    });
  }

  const deletedAccount = loginAccounts.splice(accountIndex, 1);

  res.json({
    success: true,
    message: 'Cuenta eliminada exitosamente',
    data: {
      id: deletedAccount[0].id,
      username: deletedAccount[0].username
    }
  });
};

// PUT - Actualizar contraseña
exports.updatePassword = (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos'
    });
  }

  const account = loginAccounts.find(acc => acc.username === username);

  if (!account) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  if (account.password !== oldPassword) {
    return res.status(401).json({
      success: false,
      message: 'Contraseña antigua incorrecta'
    });
  }

  account.password = newPassword;

  res.json({
    success: true,
    message: 'Contraseña actualizada exitosamente'
  });
};
