import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = 'http://localhost:3000';

export default function APITester() {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [newAccount, setNewAccount] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const setResult = useCallback((type, message) => {
    setError(type === 'error' ? message : '');
    setSuccess(type === 'success' ? message : '');
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setResult('', '');

    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
        setResult('success', 'Usuarios cargados');
      } else {
        setResult('error', data.message || 'No se pudieron cargar los usuarios');
      }
    } catch {
      setResult('error', 'Error conectando a la API. Revisa MongoDB y el backend.');
    } finally {
      setLoading(false);
    }
  }, [setResult]);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setResult('', '');

    try {
      const response = await fetch(`${API_URL}/login`);
      const data = await response.json();

      if (data.success) {
        setAccounts(data.data);
        setResult('success', 'Cuentas cargadas');
      } else {
        setResult('error', data.message || 'No se pudieron cargar las cuentas');
      }
    } catch {
      setResult('error', 'Error conectando a la API');
    } finally {
      setLoading(false);
    }
  }, [setResult]);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      setResult('error', 'Completa nombre y email');
      return;
    }

    setLoading(true);
    setResult('', '');

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();

      if (data.success) {
        setNewUser({ name: '', email: '', role: 'user' });
        setResult('success', 'Usuario creado');
        await fetchUsers();
      } else {
        setResult('error', data.message || 'No se pudo crear el usuario');
      }
    } catch {
      setResult('error', 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!newAccount.username || !newAccount.email || !newAccount.password || !newAccount.confirmPassword) {
      setResult('error', 'Completa todos los campos');
      return;
    }

    if (newAccount.password !== newAccount.confirmPassword) {
      setResult('error', 'Las contrasenas no coinciden');
      return;
    }

    setLoading(true);
    setResult('', '');

    try {
      const response = await fetch(`${API_URL}/login/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      });
      const data = await response.json();

      if (data.success) {
        setNewAccount({ username: '', email: '', password: '', confirmPassword: '' });
        setResult('success', 'Cuenta registrada');
        await fetchAccounts();
      } else {
        setResult('error', data.message || 'No se pudo registrar la cuenta');
      }
    } catch {
      setResult('error', 'Error al registrar cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      setResult('error', 'Completa usuario y contrasena');
      return;
    }

    setLoading(true);
    setResult('', '');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();

      if (data.success) {
        setLoginForm({ username: '', password: '' });
        setResult('success', `Login exitoso. Token: ${data.token.substring(0, 30)}...`);
      } else {
        setResult('error', data.message || 'Credenciales invalidas');
      }
    } catch {
      setResult('error', 'Error al hacer login');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Eliminar este usuario?')) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setResult('success', 'Usuario eliminado');
        await fetchUsers();
      } else {
        setResult('error', data.message || 'No se pudo eliminar el usuario');
      }
    } catch {
      setResult('error', 'Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm('Eliminar esta cuenta?')) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setResult('success', 'Cuenta eliminada');
        await fetchAccounts();
      } else {
        setResult('error', data.message || 'No se pudo eliminar la cuenta');
      }
    } catch {
      setResult('error', 'Error al eliminar cuenta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 0) fetchUsers();
    if (activeTab === 1) fetchAccounts();
  }, [activeTab, fetchAccounts, fetchUsers]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Probador de REST-API MongoDB
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        <Tabs value={activeTab} onChange={(event, value) => setActiveTab(value)} sx={{ mb: 3 }}>
          <Tab label="Usuarios CRUD" />
          <Tab label="Login y registro" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Crear usuario
              </Typography>
              <TextField
                fullWidth
                label="Nombre"
                value={newUser.name}
                onChange={(event) => setNewUser({ ...newUser, name: event.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(event) => setNewUser({ ...newUser, email: event.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                select
                fullWidth
                label="Rol"
                value={newUser.role}
                onChange={(event) => setNewUser({ ...newUser, role: event.target.value })}
                sx={{ mb: 2 }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
              <Button variant="contained" onClick={handleCreateUser} disabled={loading}>
                {loading ? 'Creando...' : 'Crear usuario'}
              </Button>
            </Paper>

            <Typography variant="h6" sx={{ mb: 1 }}>
              Usuarios en MongoDB
            </Typography>
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
                        No hay usuarios en la base de datos
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Probar login
              </Typography>
              <TextField
                fullWidth
                label="Usuario"
                value={loginForm.username}
                onChange={(event) => setLoginForm({ ...loginForm, username: event.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contrasena"
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="success" onClick={handleLogin} disabled={loading}>
                {loading ? 'Autenticando...' : 'Login'}
              </Button>
            </Paper>

            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Registrar cuenta
              </Typography>
              <TextField
                fullWidth
                label="Usuario"
                value={newAccount.username}
                onChange={(event) => setNewAccount({ ...newAccount, username: event.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newAccount.email}
                onChange={(event) => setNewAccount({ ...newAccount, email: event.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contrasena"
                type="password"
                value={newAccount.password}
                onChange={(event) => setNewAccount({ ...newAccount, password: event.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirmar contrasena"
                type="password"
                value={newAccount.confirmPassword}
                onChange={(event) => setNewAccount({ ...newAccount, confirmPassword: event.target.value })}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleRegister} disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </Paper>

            <Typography variant="h6" sx={{ mb: 1 }}>
              Cuentas registradas
            </Typography>
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
                        <TableCell>{account.active ? 'Activo' : 'Inactivo'}</TableCell>
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
                        No hay cuentas en la base de datos
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
        <Typography variant="h6" sx={{ mb: 1 }}>
          Instrucciones
        </Typography>
        <ol>
          <li>Revisa que MongoDB este ejecutandose en localhost:27017.</li>
          <li>Inicia la API con: cd backend y npm run dev.</li>
          <li>Usa estas pestanas para probar los endpoints.</li>
          <li>Los datos se guardan en MongoDB.</li>
        </ol>
      </Paper>
    </Container>
  );
}
