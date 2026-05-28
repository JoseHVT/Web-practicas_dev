# despliegue

## servicios usados

- base de datos: mongodb atlas
- backend: render
- frontend: vercel

## ligas finales

- frontend: `https://web-practicas-dev.vercel.app`
- api: `https://web-practicas-dev-api.onrender.com`
- health check: `https://web-practicas-dev-api.onrender.com/ping`

## backend en render

configuracion usada:

- repo: `JoseHVT/Web-practicas_dev`
- branch: `main`
- root directory: `backend`
- build command: `npm install`
- start command: `npm run seed-root-admin && npm run start`

variables:

```env
NODE_ENV=production
MONGODB_URI=<atlas_uri>
JWT_SECRET=<secret>
JWT_EXPIRES_IN=1h
PASSWORD_PEPPER=<secret>
ALLOWED_ORIGIN=https://web-practicas-dev.vercel.app
```

## frontend en vercel

configuracion usada:

- repo: `JoseHVT/Web-practicas_dev`
- branch: `main`
- root directory: `frontend`
- install command: `npm install`
- build command: `npm run build`
- output directory: `dist`

variable:

```env
VITE_API_URL=https://web-practicas-dev-api.onrender.com
```

## observaciones

- render free puede dormir la api por inactividad
- atlas debe permitir acceso de render por red
- la cuenta `root` se siembra desde el arranque del backend publicado
