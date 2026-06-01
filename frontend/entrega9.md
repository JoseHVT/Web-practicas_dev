# entrega 9

## objetivo

esta entrega agrega temas avanzados de react sobre el frontend existente, sin cambiar el backend.

## cambios realizados

### urls dinamicas

se agrego la ruta:

```text
/usuarios/:id
```

desde la lista de usuarios ahora cada registro tiene un enlace `ver detalle` que navega al detalle del usuario seleccionado.

la vista de detalle consume:

```text
GET /users/:id
```

### hooks personalizados

se agregaron dos hooks:

- `useAuth`
  - carga la sesion actual
  - expone `token`, `user`, `isAuthenticated` y `logout`
  - escucha cambios de sesion

- `useAdmin`
  - recibe el usuario autenticado
  - calcula y expone `isAdmin`

estos hooks reemplazan la logica manual previa del router principal.

### ciclo de vida con useEffect

se agrego el componente `LifecycleDemo`.

este componente imprime en consola:

- montaje
- actualizacion
- desmontaje

el demo se muestra dentro de `dashboard` con un toggle para montarlo y desmontarlo.

## como probar

1. iniciar sesion en la app
2. abrir `"/usuarios"`
3. entrar a un usuario por `ver detalle`
4. recargar la ruta `"/usuarios/:id"` y validar que sigue cargando
5. abrir `dashboard`
6. activar el demo de `useEffect`
7. revisar la consola del navegador
8. usar `incrementar` y `reiniciar`
9. ocultar el demo para validar el desmontaje

## validacion tecnica

```bash
cd frontend
npm run lint
npm run build
```

## nota

en desarrollo puede haber eventos duplicados en consola por `strictmode` de react. para la practica sigue siendo valido porque el componente si demuestra montaje, actualizacion y desmontaje.

para que la ruta dinamica funcione tambien al refrescar en vercel, se agrego `frontend/vercel.json` con un rewrite de spa hacia `index.html`.
