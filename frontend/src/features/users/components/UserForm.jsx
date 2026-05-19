import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

export default function UserForm({ open, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', password: '', role: 'user' });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>agregar nuevo usuario</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            label="nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="contrasena"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            select
            label="rol"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="user">usuario</MenuItem>
            <MenuItem value="admin">administrador</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'guardando...' : 'guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
