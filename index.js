import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import routerAPI from './routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
let count = 0;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// El frontend se ejecuta en Vite (puerto 5173) durante el desarrollo.
// Permitimos ese origen para que pueda consumir esta API en el puerto 3000.
app.use((req, res, next) => {
    const origenesPermitidos = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        process.env.FRONTEND_URL
    ].filter(Boolean);
    const origen = req.headers.origin;

    if (origenesPermitidos.includes(origen)) {
        res.header('Access-Control-Allow-Origin', origen);
        res.header('Vary', 'Origin');
    }
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.get('/', (request, response) => {
    count++;
    console.log('Cliente conectado ' + count);
    response.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static('public'));

const port = process.env.PORT || 3000;

routerAPI(app);

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
});

const startServer = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log('Server en puerto ' + port);
    });
};

startServer();
