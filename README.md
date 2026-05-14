# web-practicas_dev

Proyecto web con frontend en React y backend en Node.js, Express y MongoDB.

Repositorio:
https://github.com/JoseHVT/Web-practicas_dev.git

## Estructura

- `backend`: REST API con Express, Mongoose y MongoDB.
- `frontend`: cliente React con Vite y Material UI.
- `ENTREGA.txt`: archivo de entrega con el link del repositorio e instrucciones basicas.
- `Web_A6_Servicios_web.md`: especificacion de servicios web.

## Requisitos

- Node.js y npm.
- MongoDB ejecutandose en `localhost:27017`, o `MONGODB_URI` configurado.

## Backend

```bash
cd backend
npm install
npm run dev
```

El backend usa `http://localhost:3000`.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend usa `http://localhost:5173`.

## Seguridad de contrasenas

El backend guarda contrasenas con `crypto.scrypt` de Node.js. El metodo usa sal aleatoria y pimienta configurable con `PASSWORD_PEPPER`.

Prueba de hash:

```bash
cd backend
npm run hash-demo
```

Actualizar contrasenas existentes:

```powershell
$env:PASSWORD_UPDATES='{"admin":"admin123","user":"user123"}'
npm run update-password-hashes
```

## Validacion

Comandos usados para revisar el proyecto:

```bash
cd backend
npm run hash-demo

cd ../frontend
npm run lint
npm run build
```
