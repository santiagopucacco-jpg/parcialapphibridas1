import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const validarUsuario = ({ name, email, password }) => {
    const errores = [];

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
        errores.push('El nombre es obligatorio y debe tener al menos 3 caracteres');
    }

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
        errores.push('El email es obligatorio y debe tener un formato valido');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        errores.push('La password es obligatoria y debe tener al menos 6 caracteres');
    }

    return errores;
};

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json({ message: 'success', data: usuarios });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

const registrar = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const errores = validarUsuario(req.body);

        if (errores.length > 0) {
            return res.status(400).json({ message: 'Datos invalidos', errores });
        }

        const existe = await Usuario.findOne({ email });
        if (existe) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const usuario = await Usuario.create({ name, email, password: passwordHash, role: 'user' });
        res.status(201).json({
            message: 'Usuario registrado',
            data: { id: usuario._id, name: usuario.name, email: usuario.email, role: usuario.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y password son obligatorios' });
        }

        const usuario = await Usuario.findOne({ email }).select('+password');
        if (!usuario) {
            return res.status(401).json({ message: 'Credenciales invalidas' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: 'JWT_SECRET no esta configurado' });
        }

        const passwordOk = await bcrypt.compare(password, usuario.password);
        if (!passwordOk) {
            return res.status(401).json({ message: 'Credenciales invalidas' });
        }

        const token = jwt.sign(
            { id: usuario._id, name: usuario.name, email: usuario.email, role: usuario.role || 'user' },
            secret,
            { expiresIn: '1h' }
        );

        res.json({ message: 'success', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesion' });
    }
};

const obtenerSesion = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id);
        if (!usuario) {
            return res.status(401).json({ message: 'La cuenta asociada a la sesión ya no existe' });
        }

        res.json({
            message: 'success',
            data: { id: usuario._id, name: usuario.name, email: usuario.email, role: usuario.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'No se pudo verificar la sesión' });
    }
};

export { getUsuarios, registrar, login, obtenerSesion };
