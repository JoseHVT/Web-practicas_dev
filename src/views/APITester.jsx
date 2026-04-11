import { useState, useEffect } from 'react';
import { Container, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tab, Tabs, Box, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_URL = 'http://localhost:3000';

export default function APITester() {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [newAccount, setNewAccount] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Obtener usuarios
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
        setSuccess('Usuarios cargados');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error conectando a la API. ¿Está MongoDB ejecutándose?');
    } finally {
      setLoading(false);
    }
  };

  // Obtener cuentas de login
  const fetchAccounts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/login`);
      const data = await response.json();
      if (data.success) {
        setAccounts(data.data);
        setSuccess('Cuentas cargadas');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error conectando a la API');
    } finally {
      setLoading(false);
    }
  };

  // Crear usuario
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();

      if (data.success) {
        setSuccess('Usuario creado exitosamente');
        setNewUser({ name: '', email: '', role: 'user' });
        fetchUsers();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  // Registrar cuenta
  const handleRegister = async () => {
    if (!newAccount.username || !newAccount.email || !newAccount.password || !newAccount.confirmPassword) {
      setError('Completa todos los campos');
      return;
    }

    if (newAccount.password !== newAccount.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/login/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      });
      const data = await response.json();

      if (data.success) {
        setSuccess('Cuenta registrada exitosamente');
        setNewAccount({ username: '', email: '', password: '', confirmPassword: '' });
        fetchAccounts();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al registrar cuenta');
    } finally {
      setLoading(false);
    }
  };

  // Login
  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      setError('Completa usuario y contraseña');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(`Login exitoso! Token: ${data.token.substring(0, 30)}...`);
        setLoginForm({ username: '', password: '' });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al hacer login');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setSuccess('Usuario eliminado');
        fetchUsers();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar cuenta
  const handleDeleteAccount = async (id) => {
    if (!window.confirm('¿Eliminar esta cuenta?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setSuccess('Cuenta eliminada');
        fetchAccounts();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al eliminar cuenta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 0) fetchUsers();
    if (activeTab === 1) fetchAccounts();
  }, [activeTab]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <h1>🧪 Probador de REST-API MongoDB</h1>

        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="👥 Usuarios CRUD" />
          <Tab label="🔐 Login & Registro" />
        </Tabs>

        {/* TAB 1: USUARIOS */}
        {activeTab === 0 && (
          <Box>
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
              <h3>Crear Nuevo Usuario</h3>
              <TextField
                fullWidth
                label="Nombre"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                select
                fullWidth
                label="Rol"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </TextField>
              <Button variant="contained" onClick={handleCreateUser} disabled={loading}>
                {loading ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </Paper>

            <h3>Lista de Usuarios en MongoDB</h3>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1976d2' }}>
                    <TableCell sx={{ color: 'white' }}>Nombre</TableCell>
                    <TableCell sx={{ color: 'white' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white' }}>Rol</TableCell>
                    <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="4" align="center">
                        No hay usuarios en la BD
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* TAB 2: LOGIN */}
        {activeTab === 1 && (
          <Box>
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
              <h3>🔓 Probar Login</h3>
              <TextField
                fullWidth
                label="Usuario"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="success" onClick={handleLogin} disabled={loading}>
                {loading ? 'Autenticando...' : 'Login'}
              </Button>
            </Paper>

            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
              <h3>📝 Registrar Nueva Cuenta</h3>
              <TextField
                fullWidth
                label="Usuario"
                value={newAccount.username}
                onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newAccount.email}
                onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={newAccount.password}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                type="password"
                value={newAccount.confirmPassword}
                onChange={(e) => setNewAccount({ ...newAccount, confirmPassword: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" onClick={handleRegister} disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </Paper>

            <h3>📋 Cuentas Registradas en MongoDB</h3>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1976d2' }}>
                    <TableCell sx={{ color: 'white' }}>Usuario</TableCell>
                    <TableCell sx={{ color: 'white' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white' }}>Estado</TableCell>
                    <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>{account.username}</TableCell>
                        <TableCell>{account.email}</TableCell>
                        <TableCell>{account.active ? '✓ Activo' : '✗ Inactivo'}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="4" align="center">
                        No hay cuentas en la BD
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3, mt: 4, bgcolor: '#fff3cd' }}>
        <h3>⚠️ Instrucciones:</h3>
        <ol>
          <li>Asegúrate que MongoDB está ejecutándose en <code>localhost:27017</code></li>
          <li>Inicia la API: <code>cd api && npm run dev</code></li>
          <li>Usa estas pestañas para probar los endpoints</li>
          <li>Los datos se guardan PERMANENTEMENTE en MongoDB</li>
        </ol>
      </Paper>
    </Container>
  );
}
