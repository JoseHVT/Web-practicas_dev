import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    //simular login
    if (username && password) {
      onLogin(); // log 0-1
      navigate('/dashboard'); // hook pr vista sec
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}>
        <Typography variant="h5" textAlign="center">login</Typography>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField 
            label="Nombre de usuario" 
            variant="outlined" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField 
            label="Contraseña" 
            type="password" 
            variant="outlined" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Entrar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}