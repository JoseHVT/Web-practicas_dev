const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const {
  getAllowedOrigins,
  isProduction,
  validateRuntimeConfig
} = require('./src/config/env');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (() => {
  try {
    return getAllowedOrigins();
  } catch {
    return [];
  }
})();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('origen no permitido por cors'));
  }
};

// middlewares
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rutas iniciales
app.get('/', (req, res) => {
  res.json({
    message: 'bienvenido a la rest-api',
    status: 'active',
    version: '3.0 - jwt'
  });
});

app.get('/marco', (req, res) => {
  res.json({
    message: 'marco',
    responses: ['polo']
  });
});

app.get('/ping', (req, res) => {
  res.json({
    message: 'pong',
    timestamp: new Date()
  });
});

// rutas de usuarios
app.use('/users', require('./src/modules/users/user.route'));

// rutas de login
app.use('/login', require('./src/modules/auth/auth.route'));

// rutas de dashboard
app.use('/dashboard', require('./src/modules/dashboard/dashboard.route'));

// manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'ruta no encontrada' });
});

// manejo de errores global
app.use((err, req, res, next) => {
  if (err.message === 'origen no permitido por cors') {
    return res.status(403).json({ error: err.message });
  }

  console.error(err.stack);
  res.status(500).json({ error: 'error interno del servidor' });
});

// conectar a mongodb e iniciar servidor
const startServer = async () => {
  try {
    validateRuntimeConfig();
  } catch (error) {
    console.error(`configuracion invalida: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const connected = await connectDB();

  if (!connected) {
    if (isProduction) {
      console.error('en produccion la api requiere conexion valida a mongodb');
      process.exitCode = 1;
      return;
    }

    console.log('\niniciando servidor sin conexion a mongodb');
    console.log('los datos no se guardaran\n');
  }

  const server = app.listen(PORT);

  server.on('listening', () => {
    console.log(`servidor ejecutandose en http://localhost:${PORT}`);
    console.log(`entorno: ${process.env.NODE_ENV}`);
    if (connected) {
      console.log('base de datos: conectada\n');
    }
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`puerto ${PORT} en uso. cierra el proceso actual o cambia PORT en .env`);
      return;
    }

    console.error('error al iniciar el servidor:', error.message);
  });
};

startServer();
