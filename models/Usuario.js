import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'El email no tiene un formato valido']
    },
    password: {
        type: String,
        required: [true, 'La password es obligatoria'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

const Usuario = mongoose.model('usuarios', usuarioSchema);

export default Usuario;
