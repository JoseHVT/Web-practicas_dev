// Base de datos simulada
let users = [
  { id: 1, name: 'Juan', email: 'juan@example.com', role: 'admin' },
  { id: 2, name: 'María', email: 'maria@example.com', role: 'user' }
];

let nextId = 3;

// GET - Obtener todos los usuarios
exports.getUsers = (req, res) => {
  res.json({
    success: true,
    data: users,
    count: users.length
  });
};

// GET - Obtener usuario por ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  res.json({
    success: true,
    data: user
  });
};

// POST - Crear nuevo usuario
exports.createUser = (req, res) => {
  const { name, email, role } = req.body;

  // Validación básica
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'El nombre y email son requeridos'
    });
  }

  const newUser = {
    id: nextId++,
    name,
    email,
    role: role || 'user'
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'Usuario creado exitosamente',
    data: newUser
  });
};

// PUT - Actualizar usuario
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const user = users.find(u => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;

  res.json({
    success: true,
    message: 'Usuario actualizado exitosamente',
    data: user
  });
};

// DELETE - Eliminar usuario
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(u => u.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  const deletedUser = users.splice(userIndex, 1);

  res.json({
    success: true,
    message: 'Usuario eliminado exitosamente',
    data: deletedUser[0]
  });
};
