import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI no esta configurado');
        }

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Conexion con MongoDB Correcta');
    } catch (error) {
        console.error('Error al conectarse con mongoDB');
        console.error(error);
        process.exit(1);
    }
};
