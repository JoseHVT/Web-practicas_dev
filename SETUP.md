# 📚 GUÍA COMPLETA DE SETUP - REST-API con MongoDB

## ✅ Lo que hemos desarrollado

Una REST-API profesional con Node.js + Express conectada a **MongoDB** para gestionar:
- CRUD de usuarios
- Autenticación y registro
- Contraseñas hasheadas con bcryptjs
- Persistencia de datos en base de datos real

## 🚀 REQUISITOS PREVIOS

### 1. MongoDB debe estar instalado y ejecutándose

#### Opción A: MongoDB Community (Local)
```bash
# Windows - Descarga desde:
# https://www.mongodb.com/try/download/community

# Después de instalar, verifica que el servicio esté corriendo:
# Services → MongoDB Server debe estar activo
```

#### Opción B: MongoDB en Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Opción C: MongoDB Atlas (Cloud)
```
1. Crea cuenta en https://www.mongodb.com/cloud/atlas
2. Crea un cluster free
3. Obtén la conexión URI
4. En api/.env cambia:
   MONGODB_URI=mongodb+srv://usuario:contraseña@tu-cluster.mongodb.net/login_db
```

## 📦 INSTALACIÓN

### 1. Instalar dependencias del frontend (ya hecho)
```bash
npm install
```

### 2. Instalar dependencias del backend
```bash
cd api
npm install
```

## 🔧 CONFIGURACIÓN

### 1. Verificar MongoDB está ejecutándose
```bash
# Desde terminal separada, conecta a Mongo:
mongosh

# o si usas versión antigua:
mongo

# Deberías ver >
```

### 2. Verificar api/.env
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/login_db
JWT_SECRET=tu_clave_secreta_aqui
```

## 🎮 EJECUCIÓN

### Terminal 1 - Frontend (React)
```bash
npm run dev

# Abre: http://localhost:5173
```

### Terminal 2 - Backend (API)
```bash
cd api
npm run dev

# Verás:
# ✓ Conexión a MongoDB exitosa
# ✓ Servidor ejecutándose en http://localhost:3000
# Base de datos: Conectada
```

### Terminal 3 (Opcional) - MongoDB (si no está como servicio)
```bash
mongod
```

## 🧪 PRUEBAS EN VIVO

### Acceso a la interfaz de pruebas
```
http://localhost:5173/test-api
```

Aquí podrás probarlo directamente en el navegador:
- ✅ Crear usuarios (CRUD)
- ✅ Registrar cuentas
- ✅ Login
- ✅ Ver datos en tiempo real desde MongoDB

## 📋 ENDPOINTS DISPONIBLES

### **Ruta base:** `http://localhost:3000`

#### Iniciales
```
GET  /                 → Estado del servidor
GET  /ping             → Health check
GET  /marco            → Respuesta simple
```

#### Usuarios (CRUD)
```
GET    /users          → Obtener todos
GET    /users/:id      → Obtener por ID
POST   /users          → Crear nuevo
PUT    /users/:id      → Actualizar
DELETE /users/:id      → Eliminar
```

#### Login & Autenticación
```
POST   /login                → Login (devuelve token)
POST   /login/register       → Registrarse
GET    /login                → Listar cuentas
PUT    /login/password       → Cambiar contraseña
DELETE /login/:id            → Eliminar cuenta
```

## 🔐 Datos de Prueba

Puedes crear tus propios datos usando la interfaz en `/test-api`

O usa cURL (Terminal):
```bash
# Crear usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "email": "juan@example.com",
    "role": "user"
  }'

# Registrar cuenta
curl -X POST http://localhost:3000/login/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juanuser",
    "email": "juan@example.com",
    "password": "123456",
    "confirmPassword": "123456"
  }'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juanuser",
    "password": "123456"
  }'

# Ver todos los usuarios
curl http://localhost:3000/users

# Ver todas las cuentas
curl http://localhost:3000/login
```

## 📂 Estructura Final

```
proyecto/
├── api/                          # Backend (Node.js + Express + MongoDB)
│   ├── config/
│   │   └── db.js                # Configuración MongoDB
│   ├── models/
│   │   ├── User.js              # Esquema de usuarios
│   │   └── LoginAccount.js      # Esquema de cuentas
│   ├── controllers/
│   │   ├── userController.js    # Lógica CRUD usuarios
│   │   └── loginController.js   # Lógica login/registro
│   ├── routes/
│   │   ├── users.js             # Rutas de usuarios
│   │   └── login.js             # Rutas de login
│   ├── .env                     # Variables de entorno
│   ├── index.js                 # Servidor principal
│   └── package.json             # Dependencias
│
├── src/                          # Frontend (React)
│   ├── views/
│   │   ├── Login.jsx            # Página de login
│   │   ├── Dashboard.jsx        # Dashboard
│   │   └── APITester.jsx        # 🆕 Interfaz para probar API
│   ├── App.jsx                  # Router actualizado
│   └── ...
│
└── package.json                 # Dependencias frontend
```

## ✨ CARACTERÍSTICAS IMPLEMENTADAS

### Backend (API)
✅ Servidor Express con rutas REST
✅ Conexión a MongoDB con Mongoose
✅ Modelos validados con esquemas
✅ Contraseñas hasheadas (bcryptjs)
✅ Manejo de errores global
✅ Variables de entorno (.env)
✅ Middlewares CORS, Morgan
✅ CRUD completo para usuarios y cuentas

### Frontend (React)
✅ UI con Material-UI
✅ Página de test de API (`/test-api`)
✅ Interfaz para CRUD en vivo
✅ Mensajes de éxito/error
✅ Tablas de datos con MongoDB

##  SOLUCIÓN DE PROBLEMAS

### "Error: Cannot connect to MongoDB"
```bash
# Asegúrate de que MongoDB está ejecutándose:

# Windows:
# 1. Services → MongoDB Server → Iniciar

# O ejecuta:
mongod

# O con Docker:
docker run -d -p 27017:27017 mongo
```

### "Cannot find module 'express'"
```bash
cd api
npm install
```

### "Port 3000 already in use"
```bash
# Cambia el puerto en api/.env:
PORT=3001
```

### Datos no se guardan
```
- Verifica que MongoDB esté conectado
- Abre api/index.js en terminal - debe mostrar ✓ Conexión a MongoDB exitosa
```

## 📱 ACCESO A LA APLICACIÓN

| Página | URL | Descripción |
|--------|-----|-------------|
| Login Original | http://localhost:5173 | Login con Material-UI |
| Dashboard | http://localhost:5173/dashboard | Después de loguearse |
| **API Tester** | http://localhost:5173/test-api | 🆕 **Prueba completa aquí** |
| API (raw) | http://localhost:3000 | Endpoints JSON |

## 🎓 COMPARACIÓN: ANTES vs DESPUÉS

| Característica | Antes | Ahora |
|---|---|---|
| Almacenamiento | Memoria (datos se pierden) | MongoDB (persistente) |
| Base de datos | ❌ No | ✅ Sí |
| Verificación en vivo | ❌ Solo JSON raw | ✅ Interfaz visual |
| Contraseñas | Plain text ❌ | Hasheadas ✅ |
| Validaciones | Básicas | Mongoose schemas |

## 🚀 PROCESOS A EJECUTAR (Resumen)

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd api && npm run dev

# Terminal 3 (opcional): MongoDB
mongod

# Luego abre:
# http://localhost:5173/test-api
```

## 📖 INSTRUCCIONES ORIGINALES - CUMPLIDAS

✅ Crear proyecto Node.js (npm init -y)
✅ Instalar paquetes (express, dotenv, nodemon, cors, morgan)
✅ Crear rutas iniciales (/, /marco, /ping)
✅ Crear archivo .env
✅ Crear rutas /users con CRUD
✅ Crear rutas /login con CRUD
✅ Crear controladores
✅ Probar funcionamiento (Interfaz en /test-api)
✅ Push a GitHub

---

¡La REST-API ahora es completamente funcional y verificable en vivo! 🎉
