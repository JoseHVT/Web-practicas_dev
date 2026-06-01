import { useState } from 'react';
import { Alert, Box, Button, Paper, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../shared/services/apiClient';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';
import { saveAuthSession } from '../../../shared/utils/authSession';

const initialRegisterForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};

const isValidPassword = (password) => (
  typeof password === 'string' &&
  password.length >= 4 &&
  !/\s/.test(password)
);

export default function Login() {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setField = (setter) => (event) => {
    const { name, value } = event.target;
    setter((current) => ({ ...current, [name]: value }));
  };

  const saveSession = (token, user) => {
    saveAuthSession(token, user);
    navigate('/dashboard');
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!isValidPassword(loginForm.password)) {
      setMessage({ type: 'error', text: 'contrasena invalida' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const response = await apiClient.post('/login', loginForm);
      saveSession(response.data.token, response.data.data);
    } catch (requestError) {
      setMessage({
        type: 'error',
        text: getApiErrorMessage(requestError, 'no se pudo iniciar sesion')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!isValidPassword(registerForm.password)) {
      setMessage({ type: 'error', text: 'contrasena invalida' });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage({ type: 'error', text: 'las contrasenas no coinciden' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      await apiClient.post('/login/register', registerForm);
      const loginResponse = await apiClient.post('/login', {
        username: registerForm.username,
        password: registerForm.password
      });

      setRegisterForm(initialRegisterForm);
      saveSession(loginResponse.data.token, loginResponse.data.data);
    } catch (requestError) {
      setMessage({
        type: 'error',
        text: getApiErrorMessage(requestError, 'no se pudo registrar la cuenta')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, width: 360 }}>
        <Typography variant="h5" textAlign="center">
          acceso al sistema
        </Typography>

        <Tabs value={mode} onChange={(event, value) => setMode(value)} variant="fullWidth">
          <Tab value="login" label="login" />
          <Tab value="register" label="registro" />
        </Tabs>

        {message.text && (
          <Alert severity={message.type || 'info'}>
            {message.text}
          </Alert>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="usuario"
              name="username"
              value={loginForm.username}
              onChange={setField(setLoginForm)}
              required
            />
            <TextField
              label="contrasena"
              name="password"
              type="password"
              value={loginForm.password}
              onChange={setField(setLoginForm)}
              required
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'validando...' : 'entrar'}
            </Button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="usuario"
              name="username"
              value={registerForm.username}
              onChange={setField(setRegisterForm)}
              required
            />
            <TextField
              label="email"
              name="email"
              type="email"
              value={registerForm.email}
              onChange={setField(setRegisterForm)}
              required
            />
            <TextField
              label="contrasena"
              name="password"
              type="password"
              value={registerForm.password}
              onChange={setField(setRegisterForm)}
              required
            />
            <TextField
              label="confirmar contrasena"
              name="confirmPassword"
              type="password"
              value={registerForm.confirmPassword}
              onChange={setField(setRegisterForm)}
              required
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'registrando...' : 'crear cuenta'}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}
