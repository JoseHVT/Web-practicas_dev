# backend

rest api con node.js, express, mongoose, mongodb, crypto y jsonwebtoken.

## ejecutar

```bash
npm install
npm run dev
```

servidor:
`http://localhost:3000`

mongodb por defecto:
`mongodb://localhost:27017/login_db`

cuenta demo admin:

- usuario: `tequi`
- email: `t@gmail.com`
- contrasena: `123456`

comando para crearla o reponerla:

```bash
npm run seed-demo-admin
```

## variables

```env
MONGODB_URI=mongodb://localhost:27017/login_db
PASSWORD_PEPPER=cambia_este_valor
JWT_SECRET=cambia_este_valor
JWT_EXPIRES_IN=1h
ALLOWED_ORIGIN=http://localhost:5173
```

## hash de contrasenas

la api usa el modulo nativo `crypto` de node.js. no usa librerias externas para hashing.

metodo:

- `crypto.scrypt`
- sal aleatoria por contrasena
- pimienta con `PASSWORD_PEPPER`
- comparacion con `crypto.timingSafeEqual`

prueba:

```bash
npm run hash-demo
```

## jwt

la api usa `jsonwebtoken` para firmar y verificar tokens.

login:

```http
POST /login
```

respuesta esperada:

```json
{
  "success": true,
  "message": "login exitoso",
  "data": {
    "id": "...",
    "userId": "...",
    "username": "usuario",
    "email": "usuario@example.com",
    "role": "user"
  },
  "token": "..."
}
```

header para rutas protegidas:

```http
Authorization: Bearer <token>
```

## rutas publicas

- `POST /login`
- `POST /login/register`

## rutas protegidas para cualquier usuario autenticado

- `GET /users`
- `GET /users/:id`
- `PUT /login/password`
- `GET /dashboard/kpis`
- `GET /dashboard/charts/registrations?startDate=2026-01-01&endDate=2026-12-31`

## rutas protegidas solo para administradores

- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /login`
- `DELETE /login/:id`

## migracion de contrasenas existentes

```powershell
$env:PASSWORD_UPDATES='{"admin":"admin123","user":"user123"}'
npm run update-password-hashes
```

si una contrasena esta en texto plano, el script la convierte a hash. si ya tiene hash con otro metodo, se requiere conocer la contrasena original y pasarla en `PASSWORD_UPDATES`.

## notas de produccion

- en `production`, `MONGODB_URI`, `JWT_SECRET`, `PASSWORD_PEPPER` y `ALLOWED_ORIGIN` son obligatorios.
- cors acepta solo los origenes definidos en `ALLOWED_ORIGIN`.
- la cuenta demo admin se debe sembrar manualmente y no de forma automatica en produccion.
