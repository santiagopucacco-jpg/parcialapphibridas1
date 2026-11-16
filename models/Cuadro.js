import mongoose from 'mongoose';

const cuadroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio'],
        trim: true,
        minlength: 2
    },
    anio: {
        type: Number,
        required: [true, 'El anio es obligatorio'],
        min: 1000,
        max: new Date().getFullYear()
    },
    estilo: {
        type: String,
        trim: true
    },
    pintorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pintores',
        required: [true, 'El pintorId es obligatorio']
    },
    precioEstimado: {
        type: Number,
        min: 0
    }
});

const Cuadro = mongoose.model('cuadros', cuadroSchema);

export default Cuadro;
