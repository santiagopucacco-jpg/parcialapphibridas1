import mongoose from 'mongoose';
import { buscarPintorPorId } from '../services/pintorService.js';
import { actualizarCuadroPorId, buscarCuadroPorId, buscarCuadros, crearCuadro, eliminarCuadroPorId } from '../services/cuadroService.js';

const crearRegexSeguro = (valor, exacto = false) => {
    const texto = valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(exacto ? `^${texto}$` : texto, 'i');
};

const idInvalido = (id) => !mongoose.Types.ObjectId.isValid(id);

const getCuadros = async (req, res) => {
    try {
        const { estilo, pintorId, titulo } = req.query;
        const filtros = {};

        if (estilo) {
            filtros.estilo = crearRegexSeguro(estilo, true);
        }
        if (pintorId) {
            if (idInvalido(pintorId)) {
                return res.status(400).json({ message: 'El pintorId no tiene un formato valido' });
            }
            filtros.pintorId = pintorId;
        }
        if (titulo) {
            filtros.titulo = crearRegexSeguro(titulo);
        }

        const cuadros = await buscarCuadros(filtros);
        res.json({ message: 'success', data: cuadros });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cuadros' });
    }
};

const getCuadroBy = async (req, res) => {
    try {
        const { id } = req.params;

        if (idInvalido(id)) {
            return res.status(400).json({ message: 'El ID no tiene un formato valido' });
        }

        const cuadro = await buscarCuadroPorId(id);

        if (!cuadro) {
            return res.status(404).json({ message: 'Not Found', data: {} });
        }
        res.status(200).json({ message: 'success', data: cuadro });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cuadro' });
    }
};

const validarCuadro = ({ titulo, anio, pintorId, precioEstimado }, esUpdate = false) => {
    const errores = [];

    if (!esUpdate || titulo !== undefined) {
        if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 2) {
            errores.push('El titulo es obligatorio y debe tener al menos 2 caracteres');
        }
    }

    if (!esUpdate || anio !== undefined) {
        const anioNum = Number(anio);
        if (anio === undefined || anio === '' || isNaN(anioNum)) {
            errores.push('El anio es obligatorio y debe ser un numero');
        } else if (anioNum < 1000 || anioNum > new Date().getFullYear()) {
            errores.push(`El anio debe estar entre 1000 y ${new Date().getFullYear()}`);
        }
    }

    if (!esUpdate || pintorId !== undefined) {
        if (!pintorId || !mongoose.Types.ObjectId.isValid(pintorId)) {
            errores.push('El pintorId es obligatorio y debe ser un ID valido de MongoDB');
        }
    }

    if (precioEstimado !== undefined && (isNaN(Number(precioEstimado)) || Number(precioEstimado) < 0)) {
        errores.push('El precio estimado debe ser un numero mayor o igual a 0');
    }

    return errores;
};

const postCuadro = async (req, res) => {
    try {
        const { body } = req;
        const { titulo, anio, estilo, pintorId, precioEstimado } = body;
        const errores = validarCuadro(body);

        if (errores.length > 0) {
            return res.status(400).json({ message: 'Datos invalidos', errores });
        }

        const pintor = await buscarPintorPorId(pintorId);
        if (!pintor) {
            return res.status(404).json({ message: 'Pintor no encontrado', data: {} });
        }

        const cuadro = await crearCuadro({ titulo, anio: Number(anio), estilo, pintorId, precioEstimado });
        res.status(201).json({ message: 'Cuadro registrado', data: cuadro });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                message: 'No se pudo crear: revisá los datos ingresados',
                errores: Object.values(error.errors || {}).map((detalle) => detalle.message)
            });
        }

        console.error('Error al crear cuadro:', error);
        res.status(500).json({ message: 'No se pudo crear el cuadro. Intentá nuevamente.' });
    }
};

const updateCuadro = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const errores = validarCuadro(body, true);

        if (idInvalido(id)) {
            return res.status(400).json({ message: 'El ID no tiene un formato valido' });
        }

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
        }

        if (errores.length > 0) {
            return res.status(400).json({ message: 'Datos invalidos', errores });
        }

        if (body.pintorId) {
            const pintor = await buscarPintorPorId(body.pintorId);
            if (!pintor) {
                return res.status(404).json({ message: 'Pintor no encontrado', data: {} });
            }
        }

        const cuadro = await actualizarCuadroPorId(id, body);
        if (!cuadro) {
            return res.status(404).json({ message: 'Not Found', data: {} });
        }
        res.status(200).json({ message: 'success', data: cuadro });
    } catch (error) {
        // Una validación de Mongoose no es un error interno: se informa al
        // formulario para que el administrador pueda corregir el dato.
        if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                message: 'No se pudo actualizar: revisá los datos ingresados',
                errores: Object.values(error.errors || {}).map((detalle) => detalle.message)
            });
        }

        console.error('Error al actualizar cuadro:', error);
        res.status(500).json({ message: 'No se pudo actualizar el cuadro. Intentá nuevamente.' });
    }
};

const deleteCuadro = async (req, res) => {
    try {
        const { id } = req.params;

        if (idInvalido(id)) {
            return res.status(400).json({ message: 'El ID no tiene un formato valido' });
        }

        const cuadro = await eliminarCuadroPorId(id);

        if (!cuadro) {
            return res.status(404).json({ message: 'Not Found', data: {} });
        }
        res.status(200).json({ message: 'success', data: {} });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el cuadro' });
    }
};

export { getCuadros, getCuadroBy, postCuadro, updateCuadro, deleteCuadro };
