import { empezarTrabajoMantenimientoModel, finalizarTrabajoMantenimientoModel, obtenerMantenimientoModel, obtenerMantenimientosModel, solicitarMantenimientoModel } from "../../models/mantenimientoModel/mantenimiento.model.js";

const obtenerMantenimientos = async (req, res) => {
    try {
        const { activos, inactivos } = await obtenerMantenimientosModel();
        if (!activos && !inactivos) return res.status(404).json({
            message:"No hay mantenimientos disponibles"
        })
        return res.status(200).json({
          activos: activos,
          inactivos: inactivos,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e.message
        });
    }
}

const obtenerMantenimiento = async (req, res) => {
    const id = req.params.id.slice(1);
    try {
        const {mantenimiento, personal} = await obtenerMantenimientoModel(id);
        if (!mantenimiento) return res.status(404).json({
            message: "No existe el mantenimiento"
        });
        return res.status(200).json({
            datosMantenimiento: mantenimiento,
            personal: !personal ? "No hay personal disponible" : personal
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e.message
        });
    }
}

const solicitarMantenimiento = async (req, res) => {
    const { id_usuario, id_mantenimiento, titulo, descripcion, prioridad, id_personal } = req.body;
    if (!id_usuario && !id_mantenimiento && !titulo && !descripcion && !prioridad && !id_personal) return res.status(400).json({
        message:"Debe ingresar todos los campos"
    })
    try {
        const respuesta = await solicitarMantenimientoModel(id_usuario, id_mantenimiento, id_personal, titulo, descripcion, prioridad);
        if (respuesta) return res.status(201).json({
            message: "Ticket generado",
            ticket: respuesta
        })
    } catch (e) {
        console.log(e);
        if (e.code == 23503) return res.status(400).json({
            message: "El trabajador con ese ID no existe"
        });
        return res.status(500).json({
            message: e.message
        });
    }
}

const empezarTrabajoMantenimiento = async (req, res) => {
    const { id_ticket, id_personal } = req.body;
    try {
        const respuesta = await empezarTrabajoMantenimientoModel(id_ticket, id_personal);
        if (!respuesta) return res.status(400).json({
            message: "No fue posible registrar el trabajo"
        });
        return res.status(201).json({
            message: "El servicio está siendo registrado"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e.message
        });
    }
};

const finalizarTrabajoMantenimiento = async (req, res) => {
    const { id_registro } = req.body;
    try {
        const respuesta = await finalizarTrabajoMantenimientoModel(id_registro);
        if (!respuesta) return res.status(400).json({
            message: "No fue posible finalizar el servicio"
        });
        return res.status(201).json({
            message: "Servicio finalizado"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: e.message
        });
    }
}


export { obtenerMantenimientos, obtenerMantenimiento, solicitarMantenimiento, empezarTrabajoMantenimiento, finalizarTrabajoMantenimiento};