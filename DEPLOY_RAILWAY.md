# deploy en railway y vercel

## resumen

este proyecto se despliega como dos servicios separados:

- backend: `backend`
- frontend: `frontend`

ambos salen del mismo repositorio, usando `root directory`.

## backend

1. crea un nuevo servicio desde github.
2. selecciona este repositorio.
3. configura `root directory` en `backend`.
4. deja el start command en `npm run start`.
5. carga estas variables:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=tu_cadena_de_mongodb
JWT_SECRET=tu_secret_real
JWT_EXPIRES_IN=1h
PASSWORD_PEPPER=tu_pepper_real
ALLOWED_ORIGIN=https://tu-frontend-publico.com
```

6. despliega y valida:
   - `GET /ping`
   - `POST /login`
   - `GET /users` con token valido

7. una vez arriba, crea la cuenta de evaluacion:

```bash
npm run seed-root-admin
```

esto deja disponible:

- usuario: `root`
- email: `root@mail.com`
- contrasena: `root`

## frontend en vercel

1. crea un nuevo proyecto en vercel desde github.
2. selecciona el mismo repositorio.
3. configura `root directory` en `frontend`.
4. carga esta variable:

```env
VITE_API_URL=https://tu-backend-publico.railway.app
```

5. despliega y valida:
   - login
   - dashboard
   - usuarios
   - crud admin

## notas

- `/test-api` se mantiene como banco tecnico solo para admin.
- la cuenta `root` se crea solo para la evaluacion de este entregable.
- la cuenta demo admin no debe sembrarse automaticamente en produccion.
- si usas dominio propio, actualiza `ALLOWED_ORIGIN` al dominio final del frontend.
