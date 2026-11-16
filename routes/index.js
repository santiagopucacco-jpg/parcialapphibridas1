import pintorRouter from './pintorRouter.js';
import cuadroRouter from './cuadroRouter.js';
import usuarioRouter from './usuarioRouter.js';

const routerAPI = (app) => {
    app.use('/pintores', pintorRouter);
    app.use('/cuadros', cuadroRouter);
    app.use('/api/usuarios', usuarioRouter);
};

export default routerAPI;
