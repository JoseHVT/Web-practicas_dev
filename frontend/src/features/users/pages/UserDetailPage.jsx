import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../services/userService';
import { getApiErrorMessage } from '../../../shared/utils/apiErrors';

const formatDate = (value) => {
  if (!value) {
    return 'sin fecha';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUserById(id);

      if (data.success) {
        setUser(data.data);
        return;
      }

      setError(data.message || 'no se pudo cargar el usuario');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'error al cargar el detalle del usuario'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" component="h1">
              detalle de usuario
            </Typography>
            <Typography color="text.secondary">
              ruta dinamica activa: /usuarios/{id}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/usuarios')}
          >
            volver a usuarios
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {!loading && !error && user && (
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    id
                  </Typography>
                  <Typography sx={{ wordBreak: 'break-all' }}>
                    {user._id}
                  </Typography>
                </Box>
                <Chip
                  label={user.role === 'admin' ? 'administrador' : 'usuario'}
                  color={user.role === 'admin' ? 'primary' : 'default'}
                />
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary">
                  nombre
                </Typography>
                <Typography variant="h5">
                  {user.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary">
                  email
                </Typography>
                <Typography>
                  {user.email}
                </Typography>
              </Box>

              <Box>
                <Typography variant="overline" color="text.secondary">
                  creado
                </Typography>
                <Typography>
                  {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
