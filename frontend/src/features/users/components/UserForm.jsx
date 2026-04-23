import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

export default function UserForm({ open, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', role: 'user' }); // reset after submit
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            select
            label="Rol"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="user">Usuario</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
