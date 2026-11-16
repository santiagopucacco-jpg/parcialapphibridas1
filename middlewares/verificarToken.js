import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {
    const secret = process.env.JWT_SECRET;
    const authHeader = req.headers.authorization;

    if (!secret) {
        return res.status(500).json({ message: 'JWT_SECRET no esta configurado' });
    }

    if (!authHeader) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Debe enviar el token con el formato Bearer' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalido o expirado' });
        }

        req.usuario = decoded;
        next();
    });
};

export default verificarToken;
