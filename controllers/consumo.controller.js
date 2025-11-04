import { validarFecha } from "../helpers/funciones/validador.js";
import { obtenerConsumosDiariosModel, obtenerConsumosDiariosModelId, obtenerInfoServicioModel, registrarConsumoModel } from "../models/consumo.model.js";

export const obtenerInfoServicio = async (req, res) => {
    try {
        const respuesta = await obtenerInfoServicioModel();
        if (!respuesta)
          return res.status(404).json({
            message: "No hay servicios disponibles",
          });
        return res.status(200).json({
          message: "Consumos obtenidos",
          servicio: respuesta,
        });
    } catch (e) {
        return res.status(500).json({
          message: e.message,
        });
    }
}


export const obtenerConsumosDiariosId = async (req, res) => {
    const id = req.params.id.slice(1); /* req.params.id Comentar uno de los dos en caso de tener problemas */
    try {
        const respuesta = await obtenerConsumosDiariosModelId(id);
        if (!respuesta) return res.status(404).json({
            message: "No tiene registros de consumo"
        })
        return res.status(200).json({
            message: "Consumos obtenidos",
            consumo: respuesta
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
};

export const obtenerConsumosDiarios = async (req, res) => {
    try {
        const respuesta = await obtenerConsumosDiariosModel();
        if (!respuesta)
          return res.status(404).json({
            message: "No tiene registros de consumo",
          });
        return res.status(200).json({
          message: "Consumos obtenidos",
          consumos: respuesta,
        });
    } catch (e) {
        return res.status(500).json({
          message: e.message,
        });   
    }
}

export const registrarConsumo = async (req, res) => {
    const { departamento, servicio, fechaRegistro, medidaRegistro} = req.body;
    if (!departamento || !servicio || !fechaRegistro || !medidaRegistro) return res.status(400).json({
        message: "Debe ingresar todos los campos necesarios"
    });
    /* if (!validarFecha(fechaRegistro)) return res.status(400).json({
        message: "Fecha invalida"
    }); */
    try {
        const respuesta = await registrarConsumoModel(departamento, servicio, fechaRegistro, medidaRegistro);
        if (!respuesta) return res.status(400).json({
            message: "No se pudo registrar el consumo, intente de nuevo"
        });
        return res.status(201).json({
            message: "Consumo registrado"
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
}