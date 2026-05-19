# web-practicas_dev

proyecto web con frontend en react y backend en node.js, express y mongodb.

repositorio:
https://github.com/JoseHVT/Web-practicas_dev.git

## estructura

- `backend`: rest api con express, mongoose, mongodb, crypto y jsonwebtoken.
- `frontend`: cliente react con vite y material ui.
- `ENTREGA.txt`: archivo de entrega con el link del repositorio e instrucciones basicas.
- `Web_A6_Servicios_web.md`: especificacion de servicios web.

## requisitos

- node.js y npm.
- mongodb ejecutandose en `localhost:27017`, o `MONGODB_URI` configurado.

## backend

```bash
cd backend
npm install
npm run dev
```

el backend usa `http://localhost:3000`.

cuenta demo admin:

- usuario: `tequi`
- email: `t@gmail.com`
- contrasena: `123456`

para crearla o reponerla:

```bash
cd backend
npm run seed-demo-admin
```

variables recomendadas:

```env
MONGODB_URI=mongodb://localhost:27017/login_db
PASSWORD_PEPPER=cambia_este_valor
JWT_SECRET=cambia_este_valor
JWT_EXPIRES_IN=1h
```

## frontend

```bash
cd frontend
npm install
npm run dev
```

el frontend usa `http://localhost:5173`.

## seguridad de contrasenas

el backend guarda contrasenas con `crypto.scrypt` de node.js. el metodo usa sal aleatoria y pimienta configurable con `PASSWORD_PEPPER`.

prueba de hash:

```bash
cd backend
npm run hash-demo
```

## jwt

el login genera un token jwt firmado con `jsonwebtoken`.

las rutas protegidas requieren header:

```http
Authorization: Bearer <token>
```

rutas publicas:

- `POST /login`
- `POST /login/register`

rutas protegidas para cualquier usuario autenticado:

- `GET /users`
- `GET /users/:id`
- `PUT /login/password`
- `GET /dashboard/kpis`
- `GET /dashboard/charts/registrations`

rutas protegidas solo para administradores:

- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /login`
- `DELETE /login/:id`

en frontend:

- `/` es el acceso normal al sistema
- `/dashboard` es la vista principal tras login
- `/usuarios` permite consulta a usuarios autenticados y administracion para admins
- `/test-api` es un banco de pruebas tecnico solo para admins

## validacion

comandos usados para revisar el proyecto:

```bash
cd backend
npm run hash-demo

cd ../frontend
npm run lint
npm run build
```
