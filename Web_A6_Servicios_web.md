# web a6 - servicios web

## contexto

Proyecto web con frontend en React y backend en Node.js, Express y MongoDB.

El backend expone una REST API para usuarios, login y dashboard.

## administracion y autenticacion

El sistema permite registrar cuentas, iniciar sesion y administrar usuarios.

Las contrasenas se guardan con `crypto.scrypt`, sal aleatoria y pimienta.

### endpoints

- `POST /login` recibe `{ username, password }`
- `POST /login/register` recibe `{ username, email, password, confirmPassword }`
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

### validaciones

- `username` minimo de 3 caracteres.
- `email` unico.
- `password` minimo de 6 caracteres.
- login invalido responde `401`.

## dashboard

El backend calcula metricas usando datos de MongoDB.

### endpoints

- `GET /dashboard/kpis`
- `GET /dashboard/charts/registrations?startDate=2026-01-01&endDate=2026-12-31`

### validaciones

- `startDate` y `endDate` deben ser fechas validas.
- `endDate` debe ser mayor o igual que `startDate`.
