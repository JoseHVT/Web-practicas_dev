# ejecucion local

## requisitos

- node.js
- npm
- mongodb local en `localhost:27017`, o una `MONGODB_URI` valida

## variables de entorno

### backend

archivo recomendado: `backend/.env`

```env
MONGODB_URI=mongodb://localhost:27017/login_db
JWT_SECRET=dev_jwt_secret_change_me
JWT_EXPIRES_IN=1h
PASSWORD_PEPPER=web-practicas-dev-pepper
ALLOWED_ORIGIN=http://localhost:5173
```

### frontend

archivo recomendado: `frontend/.env`

```env
VITE_API_URL=http://localhost:3000
```

## levantar backend

```bash
cd backend
npm install
npm run dev
```

url esperada:

```text
http://localhost:3000
```

## levantar frontend

```bash
cd frontend
npm install
npm run dev
```

url esperada:

```text
http://localhost:5173
```

## cuentas de apoyo

### cuenta local previa

```bash
cd backend
npm run seed-demo-admin
```

datos:

- usuario: `tequi`
- email: `t@gmail.com`
- contrasena: `123456`

### cuenta de evaluacion

```bash
cd backend
npm run seed-root-admin
```

datos:

- usuario: `root`
- email: `root@mail.com`
- contrasena: `root`

## validacion minima

### hash

```bash
cd backend
npm run hash-demo
```

debe comprobar:

- mismo texto, mismo hash
- texto distinto, hash distinto

### frontend

```bash
cd frontend
npm run lint
npm run build
```

## prueba funcional

1. abre `http://localhost:5173`
2. inicia sesion con `root / root`
3. valida:
   - dashboard
   - usuarios
   - pruebas
