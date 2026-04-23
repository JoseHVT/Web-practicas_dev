import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UserList({ users, onDelete }) {
  if (!users || users.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">No hay usuarios registrados.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} hover>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell align="right">
                <Button 
                  color="error" 
                  size="small" 
                  startIcon={<DeleteIcon />} 
                  onClick={() => onDelete(user._id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
