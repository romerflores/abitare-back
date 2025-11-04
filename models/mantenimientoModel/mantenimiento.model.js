import { db_pool } from '../../helpers/bdConnection.js';

const obtenerMantenimientosModel = async () => {
    let response;
    let activos = []; let inactivos = [];
    const query = "SELECT * FROM tipo_mantenimiento";
    try {
        const connection = await db_pool.query(query);
        if (!connection) throw new Error("Error al requerir el servicio");
        response = connection.rows;
        response.forEach(mantenimiento => {
            if (mantenimiento.esta_activo) activos.push(mantenimiento);
            else inactivos.push(mantenimiento);
        });
        return {
            activos, inactivos
        };
    } catch (e) {
        throw e;
    }
}

const obtenerMantenimientoModel = async (id) => {
    const query = "SELECT * FROM tipo_mantenimiento WHERE id_mantenimiento = $1 AND esta_activo = TRUE";
    const parameters = [id];
    const queryPersonal = "SELECT p.id_personal, p.paterno, p.materno, p.nombres, p.celular FROM personal_mantenimiento pm JOIN personal p ON pm.id_personal = p.id_personal WHERE pm.id_mantenimiento = $1 AND estado_disponible = TRUE";
    const parametersPersonal = [id];
    let response;
    try {
        const connection = await db_pool.query(query, parameters);
        if (!connection) throw new Error("Error al requerir el servicio de mantenimiento");
        const connectionPersonal = await db_pool.query(queryPersonal, parametersPersonal);
        if (!connectionPersonal) throw new Error("Error al requerir el servicio de personal");
        response = {
            mantenimiento: connection.rows[0],
            personal: connectionPersonal.rows
        };
        return response
    } catch (e) {
        throw e;
    }
}

const solicitarMantenimientoModel = async (id_usuario, id_mantenimiento, id_personal, titulo, descripcion, prioridad) => {
    const queryTicket = "INSERT INTO ticket (titulo, descripcion, id_residente, id_mantenimiento, estado, prioridad, id_personal) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    const estado = "EN PROGRESO"
    const parametersTicket = [titulo, descripcion, id_usuario, id_mantenimiento, estado, prioridad, id_personal];
    const queryTicketNumero =
      "SELECT id_ticket FROM ticket ORDER BY fecha_creacion DESC LIMIT 1";
    try {
        const connectionTicket = await db_pool.query(queryTicket, parametersTicket);
        if (!connectionTicket.rowCount) throw new Error("No fue posible obtener el ticket");
        const connectionTicketNum = await db_pool.query(queryTicketNumero);
        return connectionTicketNum.rows[0];
    } catch (e) {
        throw e;
    }
}

const empezarTrabajoMantenimientoModel = async (id_ticket, id_personal) => {
    const queryRegistro = "INSERT INTO ticket_registro_trabajo (id_ticket, id_personal) VALUES ($1, $2)";
    const parametersRegistro = [id_ticket, id_personal];
    const queryEstadoPersonal = "UPDATE personal SET estado_disponible = FALSE WHERE id_personal = $1";
    const parametersEstado = [id_personal];
    try {
        const connectionRegistro = await db_pool.query(queryRegistro, parametersRegistro);
        if (!connectionRegistro) throw new Error("No fue posible registrar cuando comenzó el trabajo");
        const connectionActualizacion = await db_pool.query(queryEstadoPersonal, parametersEstado);
        if (!connectionActualizacion) throw new Error("No se pudo actualizar el estado del personal");
        return true;
    } catch (e) {
        throw e;
    }
};

const finalizarTrabajoMantenimientoModel = async (id_registro) => {
    const queryRegistro = "UPDATE ticket_registro_trabajo SET fecha_finalizacion = NOW() WHERE id_asignacion = $1 AND fecha_finalizacion is null";
    const parameters = [id_registro];
    try {
        const connectionRegistro = await db_pool.query(queryRegistro, parameters);
        if (!connectionRegistro) throw new Error("No se pudo finalizar el trabajo");
        return true;
    } catch (e) {
        throw e;
    }
}

export { obtenerMantenimientosModel, obtenerMantenimientoModel, solicitarMantenimientoModel, empezarTrabajoMantenimientoModel, finalizarTrabajoMantenimientoModel};