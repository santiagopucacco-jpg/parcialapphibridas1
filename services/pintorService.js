import Pintor from '../models/Pintor.js';

export const buscarPintores = (filtros) => Pintor.find(filtros);
export const buscarPintorPorId = (id) => Pintor.findById(id);
export const crearPintor = (datos) => Pintor.create(datos);
export const actualizarPintorPorId = (id, datos) => Pintor.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
export const eliminarPintorPorId = (id) => Pintor.findByIdAndDelete(id);
