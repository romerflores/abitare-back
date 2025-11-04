import { db_pool } from "../helpers/bdConnection.js";
import bcrypt from "bcrypt";

export const loginPersonalModel = async (usuario, clave, codigo) => {
  const query =
    "SELECT id_personal, nombres, paterno, materno, email, ci, clave_hasheada FROM personal WHERE email = $1";
  const parameters = [usuario];
  const queryRegistro =
    "INSERT INTO inicio_sesion (correo_residente, fecha_inicio, codigo_inicio) VALUES ($1, NOW(), $2)";
  const parametersRegistro = [usuario, codigo];
  try {
    const response = await db_pool.query(query, parameters);
    if (!response.rowCount) throw new Error("Usuario incorrecto");
    const { clave_hasheada } = response.rows[0];
    if (!(await bcrypt.compare(clave, clave_hasheada)))
      throw new Error("Contraseña incorrecta");
    const responseRegistro = await db_pool.query(
      queryRegistro,
      parametersRegistro
    );
    if (!queryRegistro)
      throw new Error("No se pudo registrar el inicio de sesion");
    const residente = response.rows[0];
    delete residente.clave_hasheada;
    return residente;
  } catch (e) {
    throw e;
  }
}

export const actualizarPrimeraClavePersonalModel = async (id, clave) => {
  const query = "UPDATE personal SET clave_hasheada = $1, fecha_actualizacion = NOW() WHERE id_personal = $2";
  const clave_hasheada = await bcrypt.hash(clave, 10);
  const parameters = [clave_hasheada, id];
  try {
    const response = await db_pool.query(query, parameters);
    if(!response) throw new Error("No se pudo actualizar, el usuario no pudo actualizarse");
    if (!response.rowCount) return false;
    return true;
  } catch(e){
    throw e;
  }
}

export const pObtenerIncidentesModel = async (id) => {
    const query = "SELECT * FROM func_obtener_incidentes_por_tecnico($1)";
    const param = [id];
    try {
        const conexion = await db_pool.query(query, param);
        if (!conexion) throw new Error("Error al realizar la accion");
        if (!conexion.rowCount) return false;
        return conexion.rows;
    } catch (e) {
        throw e;
    }
}

export const pObtenerIncidenteInfoModel = async (id) => {
    const query = "SELECT * FROM func_obtener_datos_incidente_tecnico($1)";
    const param = [id];
    try {
      const conexion = await db_pool.query(query, param);
      if (!conexion) throw new Error("Error al realizar la accion");
      if (!conexion.rowCount) return false;
      return conexion.rows[0];
    } catch (e) {
      throw e;
    }
}

export const pFinalizarTrabajoModel = async (ticket, resumen, anterior, tecnico, extra) => {
  const query = "CALL proc_personal_cierre_trabajo ($1, $2, $3, $4, $5)";
  const params = [ticket, resumen, anterior, tecnico, extra];
  try {
    const conexion = await db_pool.query(query, params);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    return true;
  } catch (e) {
    throw e;
  }
}
