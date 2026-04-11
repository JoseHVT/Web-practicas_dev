# 📮 POSTMAN - Guía de Endpoints REST-API

## 🚀 SETUP INICIAL

### 1️⃣ Asegúrate que todo está ejecutándose

```bash
# Terminal 1: Backend API
cd api
npm run dev

# Terminal 2: Frontend React
npm run dev

# MongoDB debe estar corriendo (local)
# Windows: Services → MongoDB Server (activo)
# O ejecuta: mongod
```

### 2️⃣ En Postman

1. Descarga [Postman](https://www.postman.com/downloads/)
2. Abre Postman
3. **Crea una nueva colección**: `+ New → Collection → REST-API`
4. Copia los endpoints de abajo

---

## 📌 VARIABLES GLOBALES en Postman (Opcional)

En Postman, puedes guardar variables para reutilizar:

```
HOST = localhost
PORT = 3000
BASE_URL = http://localhost:3000
```

Luego en cada request usa: `{{BASE_URL}}/users`

---

## 🔵 ENDPOINTS - RUTAS INICIALES

### 1. Health Check - GET /ping

**GET** `http://localhost:3000/ping`

**Headers:**
```
(ninguno necesario)
```

**Response (200):**
```json
{
  "message": "Pong",
  "timestamp": "2026-04-11T00:28:33.686Z"
}
```

---

### 2. Bienvenida - GET /

**GET** `http://localhost:3000/`

**Response (200):**
```json
{
  "message": "Bienvenido a la REST-API",
  "status": "active",
  "version": "2.0 - Con MongoDB"
}
```

---

### 3. Marco Polo - GET /marco

**GET** `http://localhost:3000/marco`

**Response (200):**
```json
{
  "message": "Marco",
  "responses": ["Polo"]
}
```

---

## 👥 ENDPOINTS - USUARIOS CRUD

### 1. Obtener todos los usuarios - GET /users

**GET** `http://localhost:3000/users`

**Headers:**
```
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Juan",
      "email": "juan@example.com",
      "role": "admin",
      "createdAt": "2026-04-10T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 2. Obtener usuario por ID - GET /users/:id

**GET** `http://localhost:3000/users/65a1b2c3d4e5f6g7h8i9j0k1`

**Nota:** Reemplaza `65a1b2c3d4e5f6g7h8i9j0k1` con un ID real del GET anterior

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Juan",
    "email": "juan@example.com",
    "role": "admin",
    "createdAt": "2026-04-10T10:00:00.000Z"
  }
}
```

**Response (404) - Si no existe:**
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

---

### 3. Crear usuario - POST /users

**POST** `http://localhost:3000/users`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Carlos",
  "email": "carlos@example.com",
  "role": "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "name": "Carlos",
    "email": "carlos@example.com",
    "role": "user",
    "createdAt": "2026-04-11T12:30:45.000Z"
  }
}
```

**Response (409) - Email duplicado:**
```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

---

### 4. Actualizar usuario - PUT /users/:id

**PUT** `http://localhost:3000/users/65a1b2c3d4e5f6g7h8i9j0k1`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Juan Actualizado",
  "email": "juan.nuevo@example.com",
  "role": "admin"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Juan Actualizado",
    "email": "juan.nuevo@example.com",
    "role": "admin",
    "createdAt": "2026-04-10T10:00:00.000Z"
  }
}
```

---

### 5. Eliminar usuario - DELETE /users/:id

**DELETE** `http://localhost:3000/users/65a1b2c3d4e5f6g7h8i9j0k1`

**Headers:**
```
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Juan",
    "email": "juan@example.com",
    "role": "admin",
    "createdAt": "2026-04-10T10:00:00.000Z"
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

---

## 🔐 ENDPOINTS - LOGIN/AUTENTICACIÓN

### 1. Login - POST /login

**POST** `http://localhost:3000/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "juanuser",
  "password": "mi_contraseña"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "username": "juanuser",
    "email": "juan@example.com"
  },
  "token": "token_1775867354296_65a1b2c3d4e5f6g7h8i9j0k3"
}
```

**Response (401) - Credenciales inválidas:**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

### 2. Registrarse - POST /login/register

**POST** `http://localhost:3000/login/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registro exitoso",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k4",
    "username": "newuser",
    "email": "newuser@example.com"
  }
}
```

**Response (409) - Usuario/email ya existe:**
```json
{
  "success": false,
  "message": "El usuario o email ya existe"
}
```

**Response (400) - Contraseñas no coinciden:**
```json
{
  "success": false,
  "message": "Las contraseñas no coinciden"
}
```

---

### 3. Obtener cuentas - GET /login

**GET** `http://localhost:3000/login`

**Headers:**
```
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "username": "juanuser",
      "email": "juan@example.com",
      "active": true,
      "createdAt": "2026-04-10T14:20:00.000Z"
    }
  ],
  "count": 1
}
```

**Nota:** NO devuelve las contraseñas (seguridad)

---

### 4. Cambiar contraseña - PUT /login/password

**PUT** `http://localhost:3000/login/password`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "juanuser",
  "oldPassword": "mi_contraseña",
  "newPassword": "nueva_contraseña"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

**Response (401) - Contraseña antigua incorrecta:**
```json
{
  "success": false,
  "message": "Contraseña antigua incorrecta"
}
```

---

### 5. Eliminar cuenta - DELETE /login/:id

**DELETE** `http://localhost:3000/login/65a1b2c3d4e5f6g7h8i9j0k3`

**Headers:**
```
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cuenta eliminada exitosamente",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "username": "juanuser"
  }
}
```

---

## 🧪 FLUJO DE PRUEBA RECOMENDADO

Sigue este orden en Postman para probar correctamente:

```
1. GET /ping                    → Verificar que API está viva
2. GET /                        → Check bienvenida
3. POST /login/register         → Crear una cuenta
4. POST /login                  → Autenticarse con esa cuenta
5. POST /users                  → Crear usuario
6. GET /users                   → Ver todos los usuarios
7. GET /users/:id               → Obtener uno específico
8. PUT /users/:id               → Actualizar usuario
9. DELETE /users/:id            → Eliminar usuario
10. DELETE /login/:id           → Eliminar cuenta
```

---

## 💡 PRUEBA EN VIVO (Alternativa a Postman)

Si prefieres NO usar Postman, puedes probar todo en el navegador:

**Abre:** `http://localhost:5173/test-api`

Aquí hay una interfaz visual donde puedes:
- ✅ Crear usuarios (formulario)
- ✅ Ver lista live desde MongoDB
- ✅ Registrarse e iniciar sesión
- ✅ Eliminar registros
- ✅ Todo guardado en la BD

---

## 🐛 ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot GET /` | API no está corriendo | Ejecuta `cd api && npm run dev` |
| `connect ECONNREFUSED` | MongoDB no corre | Activa MongoDB (Services o `mongod`) |
| `Invalid ObjectId` | ID de MongoDB inválido | Usa un ID válido del GET anterior |
| `CORS error` | Frontend y API puertos diferentes | Verifica que API está en 3000 |
| Email/username duplicado | Ya existe en BD | Usa otros valores o elimina primero |

---

## 📝 NOTAS IMPORTANTES

- ✅ Las contraseñas se **hashean** automáticamente (NO se guardan en texto plano)
- ✅ Los datos se guardan **permanentemente** en MongoDB
- ✅ Cada usuario tiene un `_id` único (ObjectId de MongoDB)
- ✅ El token es para ejemplo, aquí no se valida JWT (puedes agregar después)
- ✅ El rol por defecto es `"user"` si no lo especificas

---

**¡Listo para probar! 🚀**
