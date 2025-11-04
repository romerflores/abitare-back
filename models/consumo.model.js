import { db_pool } from '../helpers/bdConnection.js';

export const obtenerInfoServicioModel = async () => {
    const query = "SELECT nombre_servicio, unidad_medida, simbolo_medida, costo_por_unidad FROM servicio";
    try {
        const conexion = await db_pool.query(query);
        if (!conexion) throw new Error("No se pudo realizar la accion");
        if (!conexion.rowCount) return false;
        return conexion.rows;
    } catch (e) {
        throw e;
    }
}


export const obtenerConsumosDiariosModelId = async (id) => {
    const query = "SELECT * FROM func_obtener_registros_consumo($1)";
    const params = [id];
    try {
        const conexion = await db_pool.query(query, params);
        if (!conexion) throw new Error("No se pudo realizar la accion");
        if (!conexion.rowCount) return false;
        return conexion.rows;
    } catch (e) {
        throw e;
    }
}

export const obtenerConsumosDiariosModel = async () => {
    const query = "SELECT s.nombre_servicio as servicio, r.departamento, r.fecha_registro, r.medida_total, r.costo_total FROM servicio s INNER JOIN reg_dpto_servicio r ON s.id_servicio = r.servicio";
    try {
        const conexion = await db_pool.query(query);
        if (!conexion) throw new Error("No se pudo realizar la accion");
        if (!conexion.rowCount) return false;
        return conexion.rows;
    } catch (e) {
        throw e;
    }
}

export const registrarConsumoModel = async (dpto, servicio, fecha, medicion) => {
    const query = "CALL proc_registrar_servicio ($1, $2, $3, $4)";
    const params = [dpto, servicio, fecha, medicion];
    try {
        const conexion = await db_pool.query(query, params);
        if (!conexion) throw new Error("No se pudo realizar la accion");
        return true;
    } catch (e) {
        throw e;
    }
}