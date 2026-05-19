import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UserList({ users, onDelete, canManage }) {
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
            {canManage && <TableCell align="right" sx={{ fontWeight: 'bold' }}>acciones</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id} hover>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              {canManage && (
                <TableCell align="right">
                  <Button
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(user._id)}
                  >
                    eliminar
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
