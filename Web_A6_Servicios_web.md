# web a6 - servicios web

## contexto

proyecto web con frontend en react y backend en node.js, express y mongodb.

el backend expone una rest api para usuarios, login y dashboard.

## autenticacion

el sistema permite registrar cuentas e iniciar sesion.

las contrasenas se guardan con `crypto.scrypt`, sal aleatoria y pimienta.

el login genera un token jwt firmado con `jsonwebtoken`.

las rutas protegidas requieren:

```http
Authorization: Bearer <token>
```

## endpoints publicos

- `POST /login`
- `POST /login/register`
- `GET /`
- `GET /ping`
- `GET /marco`

## endpoints protegidos

- `GET /users`
- `GET /users/:id`
- `PUT /login/password`
- `GET /dashboard/kpis`
- `GET /dashboard/charts/registrations?startDate=2026-01-01&endDate=2026-12-31`

## endpoints solo para administradores

- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /login`
- `DELETE /login/:id`

## validaciones

- `username` minimo de 3 caracteres.
- `email` unico.
- `password` minimo de 6 caracteres.
- login invalido responde `401`.
- token ausente responde `401`.
- token invalido o expirado responde `401`.
- `startDate` y `endDate` deben ser fechas validas.
- `endDate` debe ser mayor o igual que `startDate`.

## buenas practicas aplicadas

- hash de contrasenas con sal aleatoria.
- pimienta configurable por variable de entorno.
- tokens jwt firmados y con expiracion.
- middleware unico para validar token.
- middleware de rol para rutas de administracion.
- rutas publicas separadas de rutas protegidas.
- separacion entre uso normal y banco de pruebas.
- frontend desacoplado de `localhost` mediante `VITE_API_URL`.
- cors controlado por `ALLOWED_ORIGIN`.
- el frontend guarda el token y lo envia en el header authorization.
