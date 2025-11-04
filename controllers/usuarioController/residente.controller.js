import { obtenerInformacionModel, rValidarTrabajoModel } from "../../models/usuarioModel/residente.model.js";

const obtenerInformacion = async (req, res) => {
    const id = req.params.id.slice(1);
    try {
        const respuesta = await obtenerInformacionModel(id);
        if (!respuesta) return res.status(404).json({
            message:"No se reconoció al usuario"
        })
        return res.status(200).json({
            datos: respuesta
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e.message
        });
    }
}

export const rValidarTrabajo = async (req, res) => {
    const { ticket } = req.body;
    try {
        const respuesta = await rValidarTrabajoModel(ticket);
        if (!respuesta) return res.status(400).json({
            message:"No fue validar el trabajo realizado"
        })
        return res.status(201).json({
            message: "Validacion confirmada"
        });
    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
}


export { obtenerInformacion };