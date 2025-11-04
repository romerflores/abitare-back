import { db_pool } from '../../helpers/bdConnection.js';

export const obtenerNivelModel = async () => {
    const query = "SELECT * FROM prioridad";
    try {
        const conexion = await db_pool.query(query);
        if (!conexion) throw new Error("No se pudo realizar la accion");
        return conexion.rows;
    } catch (e) {
        throw e;
    }
}

export const registrarIncidenteModel = async (titulo, descripcion, mantenimiento, residente, ubicacion, prioridad, archivos) => {
    const queryTicket = "SELECT registrar_incidente ($1, $2, $3, $4, $5, $6) AS id_ticket";
    const paramTicket = [titulo, descripcion, mantenimiento, residente, ubicacion, prioridad];
    const queryArchivo = "CALL registrar_incidente_archivos ($1, $2, $3)";
    try {
        const conexionTicket = await db_pool.query(queryTicket, paramTicket);
        if (!conexionTicket) throw new Error("No se pudo realizar la accion: generar ticket");
        const { id_ticket } = conexionTicket.rows[0];
        archivos.forEach(async (archivo) => {
            const paramArchivo = [id_ticket, archivo.originalname, archivo.mimetype];
            const respuestaArchivo = await db_pool.query(queryArchivo, paramArchivo);
            if (!respuestaArchivo) throw new Error("No se pudo realizar la accion: guardar archivo");
        });
        return true;
    } catch (e) {
        throw e;
    }
};

export const obtenerIncidentesModel = async (id) => {
  const queryIncidenteId = "SELECT * FROM func_obtener_incidentes($1)";
  const paramIncidenteId = [id];
  try {
    const conexion = await db_pool.query(queryIncidenteId, paramIncidenteId);
    if (!conexion) throw new Error("No fue posible realizar la accion");
    return conexion.rows;
  } catch (e) {
    throw e;
  }
};

export const obtenerIncidenteIdModel = async (id) => {
  const queryIncidenteId = "SELECT * FROM func_obtener_datos_incidente($1)";
  const paramIncidenteId = [id];
  try {
    const conexion = await db_pool.query(queryIncidenteId, paramIncidenteId);
    if (!conexion) throw new Error("No fue posible realizar la accion");
    return conexion.rows[0];
  } catch (e) {
    throw e;
  }
};

export const obtenerImagenesTicketModel = async (id) => {
  const query = "SELECT * FROM ticket_archivo WHERE id_ticket = $1";
  const param = [id];
  try {
    const conexion = await db_pool.query(query, param);
    if (!conexion) throw new Error("No fue posible realizar la accion");
    if (!conexion.rowCount) return false;
    return conexion.rows;
  } catch (e) {
    throw e;
  }
}
