# api y seguridad

## stack

- backend: express + mongoose
- auth: `jsonwebtoken`
- hash: `crypto.scrypt`
- frontend: react + vite

## politicas de autenticacion

- registro publico por `POST /login/register`
- login por `POST /login`
- jwt en header:

```http
Authorization: Bearer <token>
```

- roles:
  - `user`: acceso autenticado basico
  - `admin`: administracion y pruebas

## politicas de contrasena

- minimo 4 caracteres
- sin espacios
- hash con sal aleatoria
- pimienta por variable de entorno

## endpoints publicos

- `GET /`
- `GET /ping`
- `GET /marco`
- `POST /login`
- `POST /login/register`

## endpoints autenticados

- `GET /users`
- `GET /users/:id`
- `PUT /login/password`
- `GET /dashboard/kpis`
- `GET /dashboard/charts/registrations`

## endpoints solo admin

- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /login`
- `DELETE /login/:id`

## flujo funcional

- `/` es el acceso normal al sistema
- `/dashboard` es la vista principal
- `/usuarios` permite lectura a usuarios autenticados y crud completo a admins
- `/test-api` es un banco tecnico solo para admin

## payloads utiles

### registro publico de root

```json
{
  "username": "root",
  "email": "root@mail.com",
  "password": "root",
  "confirmPassword": "root"
}
```

### creacion administrativa de root

```json
{
  "name": "root",
  "email": "root@mail.com",
  "password": "root",
  "role": "admin"
}
```
