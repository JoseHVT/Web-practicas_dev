# REST-API - Login con React y Material-UI

API REST desarrollada con Node.js y Express para soportar la aplicación de Login en React.

## Estructura del Proyecto

```
api/
├── controllers/
│   ├── userController.js      # Controlador de usuarios (CRUD)
│   └── loginController.js     # Controlador de login/registro
├── routes/
│   ├── users.js               # Rutas de usuarios
│   └── login.js               # Rutas de login
├── .env                       # Variables de entorno
├── .gitignore                 # Archivos a ignorar en git
├── index.js                   # Archivo principal del servidor
└── package.json               # Dependencias del proyecto
```

## Instalación

1. Navega a la carpeta api:
```bash
cd api
```

2. Las dependencias ya están instaladas. Si necesitas instalar de nuevo:
```bash
npm install
```

## Variables de Entorno (.env)

Se incluye un archivo `.env` con las siguientes variables:
- `PORT`: Puerto del servidor (por defecto 3000)
- `NODE_ENV`: Entorno (development/production)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Configuración de base de datos
- `JWT_SECRET`: Clave secreta para tokens JWT

## Ejecución

### Modo Desarrollo (con nodemon)
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Rutas Disponibles

### Rutas Iniciales

- **GET** `/` - Mensaje de bienvenida
- **GET** `/ping` - Verificar que el servidor está activo (responde "Pong")
- **GET** `/marco` - Responde "Polo" (prueba simple)

### Rutas de Usuarios (/users)

- **GET** `/users` - Obtener todos los usuarios
- **GET** `/users/:id` - Obtener un usuario por ID
- **POST** `/users` - Crear un nuevo usuario
  ```json
  {
    "name": "Juan",
    "email": "juan@example.com",
    "role": "user"
  }
  ```
- **PUT** `/users/:id` - Actualizar un usuario
  ```json
  {
    "name": "Juan Actualizado",
    "email": "juan.nuevo@example.com",
    "role": "admin"
  }
  ```
- **DELETE** `/users/:id` - Eliminar un usuario

### Rutas de Login (/login)

- **POST** `/login` - Autenticación
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```

- **POST** `/login/register` - Registro de nuevo usuario
  ```json
  {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

- **GET** `/login` - Obtener todas las cuentas de login

- **DELETE** `/login/:id` - Eliminar una cuenta de login

- **PUT** `/login/password` - Cambiar contraseña
  ```json
  {
    "username": "admin",
    "oldPassword": "admin123",
    "newPassword": "newpassword"
  }
  ```

## Usuarios por Defecto

Para probar el login, puedes usar:

| Username | Password | Email |
|----------|----------|-------|
| admin | admin123 | admin@example.com |
| user | user123 | user@example.com |

## Testing con cURL

```bash
# Obtener todos los usuarios
curl http://localhost:3000/users

# Crear un nuevo usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Carlos","email":"carlos@example.com","role":"user"}'

# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Registro
curl -X POST http://localhost:3000/login/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"newuser@example.com","password":"pass123","confirmPassword":"pass123"}'

# Obtener usuario por ID
curl http://localhost:3000/users/1

# Actualizar usuario
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan.perez@example.com"}'

# Eliminar usuario
curl -X DELETE http://localhost:3000/users/2
```

## Testing con Postman

1. Importa las rutas en Postman
2. Usa el puerto 3000 para todas las solicitudes
3. Configura el Content-Type como application/json para POST y PUT

## Próximas Mejoras

- [ ] Integración con base de datos real (MySQL/MongoDB)
- [ ] Implementación de JWT para autenticación
- [ ] Validación avanzada con express-validator
- [ ] Hash de contraseñas con bcrypt
- [ ] Tests unitarios con Jest
- [ ] Documentación automática con Swagger

## Middlewares Utilizados

- **express**: Framework web
- **cors**: Habilita solicitudes desde diferentes orígenes
- **morgan**: Logger HTTP para ver las solicitudes
- **dotenv**: Cargar variables de entorno desde .env

## Notas

- Los datos se almacenan en memoria (se pierden al reiniciar el servidor)
- Para producción, se recomienda usar una base de datos real
- Las contraseñas no están encriptadas (no usar en producción)
