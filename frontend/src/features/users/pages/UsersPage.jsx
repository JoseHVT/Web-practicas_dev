import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import { getUsers, createUser, deleteUser } from '../services/userService';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      if (data.success) {
        setUsers(data.data);
      } else {
        showNotification(data.message || 'Error al cargar usuarios', 'error');
      }
    } catch (error) {
      showNotification('Error de conexión con la API', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (userData) => {
    try {
      setLoading(true);
      const data = await createUser(userData);
      if (data.success) {
        showNotification('Usuario creado correctamente');
        setIsModalOpen(false);
        loadUsers(); // Refresh table
      } else {
        showNotification(data.message || 'Error al crear usuario', 'error');
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error de servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    
    try {
      setLoading(true);
      const data = await deleteUser(id);
      if (data.success) {
        showNotification('Usuario eliminado');
        loadUsers(); // Refresh table
      } else {
        showNotification(data.message || 'Error al eliminar usuario', 'error');
      }
    } catch (error) {
      showNotification('Error al conectar con la API', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestión de Usuarios
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Agregar Usuario
        </Button>
      </Box>

      <UserList users={users} onDelete={handleDeleteUser} />

      <UserForm 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddUser}
        loading={loading}
      />

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
