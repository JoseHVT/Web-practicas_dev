import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link as RouterLink } from 'react-router-dom';

export default function UserList({ users, onDelete, onEdit, canManage }) {
  if (!users || users.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">no hay usuarios registrados.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>nombre</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>rol</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>detalle</TableCell>
            {canManage && <TableCell align="right" sx={{ fontWeight: 'bold' }}>acciones</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} hover>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  component={RouterLink}
                  to={`/usuarios/${user._id}`}
                  color="primary"
                  size="small"
                  startIcon={<VisibilityIcon />}
                >
                  ver detalle
                </Button>
              </TableCell>
              {canManage && (
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      color="primary"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => onEdit(user)}
                    >
                      editar
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => onDelete(user._id)}
                    >
                      eliminar
                    </Button>
                  </Stack>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
