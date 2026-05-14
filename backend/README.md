# backend

REST API con Node.js, Express, Mongoose y MongoDB.

## Ejecutar

```bash
npm install
npm run dev
```

Servidor:
`http://localhost:3000`

MongoDB por defecto:
`mongodb://localhost:27017/login_db`

Tambien se puede configurar `MONGODB_URI` en `.env`.

## Rutas

Rutas base:

- `GET /`
- `GET /ping`
- `GET /marco`

Usuarios:

- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

Login:

- `POST /login`
- `POST /login/register`
- `GET /login`
- `PUT /login/password`
- `DELETE /login/:id`

Dashboard:

- `GET /dashboard/kpis`
- `GET /dashboard/charts/registrations?startDate=2026-01-01&endDate=2026-12-31`

## Hash de contrasenas

La API usa el modulo nativo `crypto` de Node.js. No usa librerias externas para hashing.

Metodo:

- `crypto.scrypt`
- sal aleatoria por contrasena
- pimienta con `PASSWORD_PEPPER`
- comparacion con `crypto.timingSafeEqual`

Prueba:

```bash
npm run hash-demo
```

Migracion de contrasenas existentes:

```powershell
$env:PASSWORD_UPDATES='{"admin":"admin123","user":"user123"}'
npm run update-password-hashes
```

Si una contrasena esta en texto plano, el script la convierte a hash. Si ya tiene hash con otro metodo, se requiere conocer la contrasena original y pasarla en `PASSWORD_UPDATES`.
