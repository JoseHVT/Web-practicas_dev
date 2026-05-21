import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Container, Snackbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import { createUser, deleteUser, getUsers, updateUser } from '../services/userService';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';
import { clearAuthSession, getAuthUser, updateAuthUser } from '../../../shared/utils/authSession';

export default function UsersPage({ isAdmin }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  }, []);

  const handleCloseNotification = () => setNotification((current) => ({ ...current, open: false }));
  const closeForm = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormMode('create');
  };

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
      showNotification(getApiErrorMessage(error, 'error de conexion con la api'), 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const syncCurrentSessionIfNeeded = (userData) => {
    const currentUser = getAuthUser();

    if (!currentUser || currentUser.userId !== userData._id) {
      return;
    }

    updateAuthUser({
      ...currentUser,
      username: userData.name,
      email: userData.email,
      role: userData.role
    });
  };

  const handleCreateUser = async (userData) => {
    try {
      setLoading(true);
      const data = await createUser(userData);

      if (data.success) {
        showNotification('usuario creado correctamente');
        closeForm();
        await loadUsers();
      } else {
        showNotification(data.message || 'error al crear usuario', 'error');
      }
    } catch (error) {
      showNotification(getApiErrorMessage(error, 'error de servidor'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (userData) => {
    if (!selectedUser) {
      return;
    }

    try {
      setLoading(true);
      const data = await updateUser(selectedUser._id, userData);

      if (data.success) {
        syncCurrentSessionIfNeeded(data.data);
        showNotification('usuario actualizado correctamente');
        closeForm();
        await loadUsers();
      } else {
        showNotification(data.message || 'error al actualizar usuario', 'error');
      }
    } catch (error) {
      showNotification(getApiErrorMessage(error, 'error de servidor'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUser = async (userData) => {
    if (formMode === 'edit') {
      await handleEditUser(userData);
      return;
    }

    await handleCreateUser(userData);
  };

  const openCreateModal = () => {
    setFormMode('create');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setFormMode('edit');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('eliminar este usuario?')) return;

    try {
      setLoading(true);
      const data = await deleteUser(id);

      if (data.success) {
        const currentUser = getAuthUser();

        if (currentUser?.userId === id) {
          clearAuthSession();
          window.location.assign('/');
          return;
        }

        showNotification('usuario eliminado');
        await loadUsers();
      } else {
        showNotification(data.message || 'error al eliminar usuario', 'error');
      }
    } catch (error) {
      showNotification(getApiErrorMessage(error, 'error al conectar con la api'), 'error');
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
            onClick={openCreateModal}
          >
            agregar usuario
          </Button>
        )}
      </Box>

      <UserList
        users={users}
        onDelete={handleDeleteUser}
        onEdit={openEditModal}
        canManage={isAdmin}
      />

      {isAdmin && (
        <UserForm
          key={`${formMode}-${selectedUser?._id || 'new'}-${isModalOpen ? 'open' : 'closed'}`}
          open={isModalOpen}
          onClose={closeForm}
          onSubmit={handleSubmitUser}
          loading={loading}
          mode={formMode}
          initialValues={selectedUser}
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
