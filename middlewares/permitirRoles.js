const permitirRoles = (...rolesPermitidos) => (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.role)) {
        return res.status(403).json({ message: 'No tenes permisos para realizar esta acción' });
    }

    next();
};

export default permitirRoles;
