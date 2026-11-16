# Galería de Arte

Proyecto para la materia Aplicaciones Híbridas. Es una aplicación MERN para consultar y administrar una colección de pintores y cuadros.

## Funcionalidades

- Registro e inicio de sesión.
- Contraseñas encriptadas con bcrypt y autenticación con JWT.
- Listado, filtros y búsqueda de pintores y cuadros.
- CRUD de pintores y cuadros para el rol administrador.
- Relación entre cada cuadro y su pintor.
- Rutas protegidas y manejo de roles (`user` y `admin`).

## Tecnologías

- Backend: Node.js, Express, MongoDB Atlas, Mongoose, JWT y bcrypt.
- Frontend: React, Vite, React Router y Context API.

## Usuario administrador para probar el CRUD

- Email: `prueba.parcial1@ejemplo.test`
- Contraseña: `Prueba123`

Los usuarios registrados desde la aplicación reciben el rol `user`. Pueden recorrer la galería, pero las altas, ediciones y bajas quedan reservadas al administrador.

## Cómo levantar el proyecto

Se necesitan dos terminales.

### Backend

Desde la carpeta principal:

```bash
npm install
npm run dev
```

Crear un archivo `.env` en la raíz con los datos de conexión:

```env
PORT=3000
JWT_SECRET=una_clave_secreta
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/galeriaArte?retryWrites=true&w=majority
```

### Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://127.0.0.1:5173` en el navegador. La API se ejecuta en `http://127.0.0.1:3000`.

## Estructura

```text
config/          conexión a MongoDB
controllers/     lógica de usuarios, pintores y cuadros
middlewares/     JWT y control de roles
models/          esquemas de MongoDB
routes/          rutas de la API
services/        consultas a la base de datos
frontend/        aplicación React
```

## Endpoints principales

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/usuarios/registro` | Registra un usuario. |
| POST | `/api/usuarios/login` | Inicia sesión y devuelve un token. |
| GET/POST/PUT/DELETE | `/pintores` | Consulta y administración de pintores. |
| GET/POST/PUT/DELETE | `/cuadros` | Consulta y administración de cuadros. |

Las operaciones de alta, edición y baja requieren un token JWT de administrador.
