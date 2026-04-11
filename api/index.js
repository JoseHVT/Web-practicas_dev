const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas iniciales
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la REST-API',
    status: 'active'
  });
});

app.get('/marco', (req, res) => {
  res.json({
    message: 'Marco',
    responses: ['Polo']
  });
});

app.get('/ping', (req, res) => {
  res.json({
    message: 'Pong',
    timestamp: new Date()
  });
});

// Rutas de usuarios (por implementar)
app.use('/users', require('./routes/users'));

// Rutas de login (por implementar)
app.use('/login', require('./routes/login'));

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV}`);
});
