import express from 'express';
import { getUsuarios, registrar, login, obtenerSesion } from '../controllers/usuarioController.js';
import verificarToken from '../middlewares/verificarToken.js';

const router = express.Router();

const registro = (request, response) => {
    response.send(`<!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Registro</title>
                    </head>
                    <body>
                        <form action="/api/usuarios/registro" method="post" enctype="application/x-www-form-urlencoded">
                            <label for="name">Nombre</label>
                            <input id="name" name="name" type="text">

                            <label for="email">Email</label>
                            <input id="email" name="email" type="email">

                            <label for="password">Password</label>
                            <input id="password" name="password" type="password">

                            <button type="submit">Registrarme</button>
                        </form>
                    </body>
                    </html>`);
};

router.get('/', getUsuarios);
router.get('/registro', registro);
router.post('/registro', registrar);
router.post('/login', login);
router.get('/sesion', verificarToken, obtenerSesion);

export default router;
