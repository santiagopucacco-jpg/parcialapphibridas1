import express from 'express';
import {
    getCuadros,
    getCuadroBy,
    postCuadro,
    updateCuadro,
    deleteCuadro
} from '../controllers/cuadroController.js';
import verificarToken from '../middlewares/verificarToken.js';
import permitirRoles from '../middlewares/permitirRoles.js';

const router = express.Router();

router.get('/', getCuadros);
router.get('/:id', getCuadroBy);
router.post('/', verificarToken, permitirRoles('admin'), postCuadro);
router.put('/:id', verificarToken, permitirRoles('admin'), updateCuadro);
router.delete('/:id', verificarToken, permitirRoles('admin'), deleteCuadro);

export default router;
