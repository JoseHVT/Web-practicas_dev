import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Container, Snackbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import { getUsers, createUser, deleteUser } from '../services/userService';

export default function UsersPage({ isAdmin }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  }, []);

  const handleCloseNotification = () => setNotification((current) => ({ ...current, open: false }));

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers();

      if (data.success) {
        setUsers(data.data);
      } else {
        showNotification(data.message || 'error al cargar usuarios', 'error');
      }
    } catch (error) {
      showNotification('error de conexion con la api', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAddUser = async (userData) => {
    try {
      setLoading(true);
      const data = await createUser(userData);

      if (data.success) {
        showNotification('usuario creado correctamente');
        setIsModalOpen(false);
        loadUsers();
      } else {
        showNotification(data.message || 'error al crear usuario', 'error');
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'error de servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('eliminar este usuario?')) return;

    try {
      setLoading(true);
      const data = await deleteUser(id);

      if (data.success) {
        showNotification('usuario eliminado');
        loadUsers();
      } else {
        showNotification(data.message || 'error al eliminar usuario', 'error');
      }
    } catch {
      showNotification('error al conectar con la api', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            gestion de usuarios
          </Typography>
          {!isAdmin && (
            <Typography color="text.secondary">
              modo lectura. solo los administradores pueden crear o eliminar usuarios.
            </Typography>
          )}
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            agregar usuario
          </Button>
        )}
      </Box>

      <UserList users={users} onDelete={handleDeleteUser} canManage={isAdmin} />

      {isAdmin && (
        <UserForm
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddUser}
          loading={loading}
        />
      )}

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
