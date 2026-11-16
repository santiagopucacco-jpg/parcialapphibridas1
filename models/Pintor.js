import mongoose from 'mongoose';

const pintorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        minlength: 3
    },
    nacionalidad: {
        type: String,
        required: [true, 'La nacionalidad es obligatoria'],
        trim: true
    },
    anioNacimiento: {
        type: Number,
        required: [true, 'El anio de nacimiento es obligatorio'],
        min: 1000,
        max: new Date().getFullYear()
    },
    activo: {
        type: Boolean,
        default: true
    }
});

const Pintor = mongoose.model('pintores', pintorSchema);

export default Pintor;
