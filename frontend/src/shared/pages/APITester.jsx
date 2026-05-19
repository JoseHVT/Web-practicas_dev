import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';

const API_URL = 'http://localhost:3000';
const TEST_TOKEN_KEY = 'apiTestToken';

const createTestAccount = () => {
  const stamp = Date.now();

  return {
    username: `test_${stamp}`,
    email: `test_${stamp}@example.com`,
    password: 'password123',
    confirmPassword: 'password123'
  };
};

export default function APITester() {
  const [token, setToken] = useState(localStorage.getItem(TEST_TOKEN_KEY) || '');
  const [account, setAccount] = useState(createTestAccount);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const showResult = (label, response, body) => {
    setError('');
    setResult(`${label}: http ${response.status}\n${JSON.stringify(body, null, 2)}`);
  };

  const runRequest = async (label, path, options = {}) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}${path}`, options);
      const body = await response.json();
      showResult(label, response, body);
      return { response, body };
    } catch {
      setResult('');
      setError('error conectando con la api');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const testPing = () => runRequest('ping publico', '/ping');

  const testProtectedWithoutToken = () => runRequest('users sin token', '/users');

  const registerTestAccount = async () => {
    const request = await runRequest('registro publico', '/login/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account)
    });

    if (request?.response.status === 201) {
      setResult((current) => `${current}\n\ncuenta de prueba creada. ahora ejecuta login.`);
    }
  };

  const loginTestAccount = async () => {
    const request = await runRequest('login publico', '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: account.username,
        password: account.password
      })
    });

    if (request?.body?.token) {
      localStorage.setItem(TEST_TOKEN_KEY, request.body.token);
      setToken(request.body.token);
    }
  };

  const testProtectedWithToken = () => runRequest('dashboard con token', '/dashboard/kpis', {
    headers: authHeaders
  });

  const clearToken = () => {
    localStorage.removeItem(TEST_TOKEN_KEY);
    setToken('');
    setResult('token de prueba eliminado');
    setError('');
  };

  const resetAccount = () => {
    setAccount(createTestAccount());
    setResult('cuenta de prueba reiniciada');
    setError('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          banco de pruebas api
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          esta pantalla valida endpoints. el uso normal del sistema esta en login, registro, dashboard y usuarios. aqui se usa un token de prueba separado.
        </Typography>

        <Alert severity={token ? 'success' : 'info'} sx={{ mb: 3 }}>
          {token ? 'token activo para pruebas protegidas' : 'sin token activo'}
        </Alert>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <TextField
              label="usuario de prueba"
              value={account.username}
              onChange={(event) => setAccount((current) => ({ ...current, username: event.target.value }))}
            />
            <TextField
              label="email de prueba"
              type="email"
              value={account.email}
              onChange={(event) => setAccount((current) => ({ ...current, email: event.target.value }))}
            />
            <TextField
              label="contrasena"
              type="password"
              value={account.password}
              onChange={(event) => setAccount((current) => ({
                ...current,
                password: event.target.value,
                confirmPassword: event.target.value
              }))}
            />
            <Button variant="outlined" onClick={resetAccount} disabled={loading}>
              reiniciar cuenta de prueba
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Button variant="contained" onClick={testPing} disabled={loading}>
              probar ping publico
            </Button>
            <Button variant="contained" onClick={testProtectedWithoutToken} disabled={loading}>
              probar users sin token
            </Button>
            <Button variant="contained" onClick={registerTestAccount} disabled={loading}>
              registrar cuenta de prueba
            </Button>
            <Button variant="contained" onClick={loginTestAccount} disabled={loading}>
              login y guardar token
            </Button>
            <Button variant="contained" onClick={testProtectedWithToken} disabled={loading || !token}>
              probar dashboard con token
            </Button>
            <Button variant="outlined" color="error" onClick={clearToken} disabled={loading || !token}>
              borrar token
            </Button>
          </Box>

          {result && (
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f8f8' }}>
              <Typography component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {result}
              </Typography>
            </Paper>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
