const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

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
    status: 'active',
    version: '2.0 - Con MongoDB'
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

// Rutas de usuarios
app.use('/users', require('./src/modules/users/user.route'));

// Rutas de login
app.use('/login', require('./src/modules/auth/auth.route'));

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Conectar a MongoDB e iniciar servidor
const startServer = async () => {
  const connected = await connectDB();

  if (!connected) {
    console.log('\n⚠️  Iniciando servidor sin conexión a MongoDB');
    console.log('   Los datos NO se guardarán\n');
  }

  app.listen(PORT, () => {
    console.log(`✓ Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`  Entorno: ${process.env.NODE_ENV}`);
    if (connected) {
      console.log('  Base de datos: Conectada\n');
    }
  });
};

startServer();

