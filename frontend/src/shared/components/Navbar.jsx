import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onLogout, isAdmin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          mi app
        </Typography>
        <Button color="inherit" onClick={() => navigate('/dashboard')}>dashboard</Button>
        <Button color="inherit" onClick={() => navigate('/usuarios')}>usuarios</Button>
        {isAdmin && <Button color="inherit" onClick={() => navigate('/test-api')}>pruebas</Button>}
        <Button color="inherit" onClick={handleLogout}>logout</Button>
      </Toolbar>
    </AppBar>
  );
}
