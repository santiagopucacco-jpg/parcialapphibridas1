import mongoose from 'mongoose';
import { actualizarPintorPorId, buscarPintorPorId, buscarPintores, crearPintor, eliminarPintorPorId } from '../services/pintorService.js';

const crearRegexSeguro = (valor, exacto = false) => {
    const texto = valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(exacto ? `^${texto}$` : texto, 'i');
};

const idInvalido = (id) => !mongoose.Types.ObjectId.isValid(id);

const getPintores = async (req, res) => {
    try {
        const { nacionalidad, activo, nombre } = req.query;
        const filtros = {};

        if (nacionalidad) {
            filtros.nacionalidad = crearRegexSeguro(nacionalidad, true);
        }
        if (activo !== undefined) {
            filtros.activo = activo === 'true';
        }
        if (nombre) {
            filtros.nombre = crearRegexSeguro(nombre);
        }

        const pintores = await buscarPintores(filtros);
        res.json({ message: 'success', data: pintores });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pintores' });
    }
};

const getPintorBy = async (req, res) => {
    try {
        const { id } = req.params;

        if (idInvalido(id)) {
            return res.status(400).json({ message: 'El ID no tiene un formato valido' });
        }

        const pintor = await buscarPintorPorId(id);

        if (!pintor) {
            return res.status(404).json({ message: 'Not Found', data: {} });
        }
        res.status(200).json({ message: 'success', data: pintor });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pintor' });
    }
};

const validarPintor = ({ nombre, nacionalidad, anioNacimiento, activo }, esUpdate = false) => {
    const errores = [];

    if (!esUpdate || nombre !== undefined) {
        if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
            errores.push('El nombre es obligatorio y debe tener al menos 3 caracteres');
        }
    }

    if (!esUpdate || nacionalidad !== undefined) {
        if (!nacionalidad || typeof nacionalidad !== 'string') {
            errores.push('La nacionalidad es obligatoria y debe ser texto');
        }
    }

    if (!esUpdate || anioNacimiento !== undefined) {
        const anioNum = Number(anioNacimiento);
        if (anioNacimiento === undefined || anioNacimiento === '' || isNaN(anioNum)) {
            errores.push('El anio de nacimiento es obligatorio y debe ser un numero');
        } else if (anioNum < 1000 || anioNum > new Date().getFullYear()) {
            errores.push(`El anio de nacimiento debe estar entre 1000 y ${new Date().getFullYear()}`);
        }
    }

    if (activo !== undefined && typeof activo !== 'boolean') {
        errores.push('El campo activo debe ser true o false');
    }

    return errores;
};

const postPintor = async (req, res) => {
    try {
        const errores = validarPintor(req.body);

        if (errores.length > 0) {
            return res.status(400).json({ message: 'Datos invalidos', errores });
        }

        const { nombre, nacionalidad, anioNacimiento, activo } = req.body;
        const pintor = await crearPintor({ nombre, nacionalidad, anioNacimiento: Number(anioNacimiento), activo });
        res.status(201).json({ message: 'Pintor registrado', data: pintor });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pintor' });
    }
};

const updatePintor = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;

        if (idInvalido(id)) {
            return res.status(400).json({ message: 'El ID no tiene un formato valido' });
        }

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
        }

        const errores = validarPintor(body, true);
        if (errores.length > 0) {
            return res.status(400).json({ message: 'Datos invalidos', errores });
        }

        const pintor = await actualizarPintorPorId(id, body);
        if (!pintor) {
            return res.status(404).json({ message: 'Not Found', data: {} });
        }
        res.status(200).json({ message: 'success', data: pintor });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pintor' });
    }
};

const deletePintor = async (req, res) => {
    try {
        const { id } = req.params;

        if (idInvalido(id)) {
            return res.status(400).json({ message: 'El ID no tiene un formato valido' });
        }

        const pintor = await eliminarPintorPorId(id);

        if (!pintor) {
            return res.status(404).json({ message: 'Not Found', data: {} });
        }
        res.status(200).json({ message: 'success', data: {} });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pintor' });
    }
};

export { getPintores, getPintorBy, postPintor, updatePintor, deletePintor };
