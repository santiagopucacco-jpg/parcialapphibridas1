import express from 'express';
import {
    getPintores,
    getPintorBy,
    postPintor,
    updatePintor,
    deletePintor
} from '../controllers/pintorController.js';
import verificarToken from '../middlewares/verificarToken.js';
import permitirRoles from '../middlewares/permitirRoles.js';

const router = express.Router();

router.get('/', getPintores);
router.get('/:id', getPintorBy);
router.post('/', verificarToken, permitirRoles('admin'), postPintor);
router.put('/:id', verificarToken, permitirRoles('admin'), updatePintor);
router.delete('/:id', verificarToken, permitirRoles('admin'), deletePintor);

export default router;
