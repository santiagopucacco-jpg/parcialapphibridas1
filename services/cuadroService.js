import Cuadro from '../models/Cuadro.js';

export const buscarCuadros = (filtros) => Cuadro.find(filtros).populate('pintorId');
export const buscarCuadroPorId = (id) => Cuadro.findById(id).populate('pintorId');
export const crearCuadro = (datos) => Cuadro.create(datos);
export const actualizarCuadroPorId = (id, datos) => Cuadro.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
export const eliminarCuadroPorId = (id) => Cuadro.findByIdAndDelete(id);
