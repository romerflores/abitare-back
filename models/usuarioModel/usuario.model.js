import { db_pool } from "../../helpers/bdConnection.js";

export const validarCodigoRecuperacionModel = async (codigo)=>{
    const query = "SELECT 1 FROM cambio_contrasenia WHERE codigo_email = $1 AND estado_clave";
    const param = [codigo];
    const queryUpdate = "UPDATE cambio_contrasenia SET estado_clave = FALSE";
    try {
        const conexion = await db_pool.query(query, param);
        if (!conexion) throw new Error("No se pudo realizar la accion");
        if (!conexion.rowCount) return false;
        const conexionUpdate = await db_pool.query(queryUpdate);
        if (!conexionUpdate) throw new Error("No se pudo realizar la accion");
        if (!conexionUpdate.rowCount) return false;
        return true;
    } catch (e) {
        throw e;
    }
} 