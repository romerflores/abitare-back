import bcrypt from "bcrypt";
import { db_pool } from "../../helpers/bdConnection.js";

const loginResidenteModel = async (usuario, clave, codigo) => {
  const query =
    "SELECT id_residente, nombre, paterno, materno, correo, ci, clave_hasheada, tipo_residente FROM residente WHERE correo = $1";
  const parameters = [usuario];
  const queryRegistro = "INSERT INTO inicio_sesion (correo_residente, fecha_inicio, codigo_inicio) VALUES ($1, NOW(), $2)";
  const parametersRegistro = [usuario, codigo];
  try {
    const response = await db_pool.query(query, parameters);
    if (!response.rowCount) throw new Error("Usuario incorrecto");
    const { clave_hasheada } = response.rows[0];
    if (!(await bcrypt.compare(clave, clave_hasheada)))
      throw new Error("Contraseña incorrecta");
    const responseRegistro = await db_pool.query(queryRegistro, parametersRegistro);
    if (!queryRegistro) throw new Error("No se pudo registrar el inicio de sesion");
    const residente = response.rows[0];
    delete residente.clave_hasheada;
    return residente;
  } catch (e) {
    throw e;
  }
};

const actualizarPrimeraClaveResidenteModel = async (id, clave) => {
  const query = "UPDATE residente SET clave_hasheada = $1, fecha_cambio_clave = NOW() WHERE id_residente = $2";
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

const validarCodigoModel = async (codigo) => {
  const query = "SELECT correo_residente as correo FROM inicio_sesion WHERE codigo_inicio = $1";
  const parameters = [codigo];
  try {
    const response = await db_pool.query(query, parameters);
    if (!response) throw new Error("Error al usar el servicio");
    return response.rows[0];
  } catch (e) {
    throw e;
  }
}

const obtenerInformacionModel = async (id) => {
  const query = "SELECT nombre, paterno, materno, correo, ci, r.id_departamento, piso, numero FROM residente r JOIN departamento d ON r.id_departamento = d.id_departamento WHERE r.id_residente = $1";
  const parameters = [id];
  try {
    const connection = await db_pool.query(query, parameters);
    if (!connection) throw new Error("No se pudieron obtener los datos");
    return connection.rows[0];
  } catch (e) {
    throw e;
  }
}

const registrarClave = async (usuario, codigo) => {
  const queryUsuario = "SELECT 1 FROM residente WHERE correo = $1";
  const paramUsuario = [usuario];
  const queryClave = "INSERT INTO cambio_contrasenia (usuario, fecha_cambio, codigo_email) VALUES ($1, NOW(), $2)";
  const paramClave = [usuario, codigo];
  try {
    const conexionUsuario = await db_pool.query(queryUsuario, paramUsuario)
    if (!conexionUsuario) throw new Error("No se pudo realizar la accion: obtener usuario");
    if (!conexionUsuario.rowCount) return false;
    const conexionClave = await db_pool.query(queryClave, paramClave);
    if (!conexionClave) throw new Error("No se pudo realizar la accion: registrar codigo");
    return true;
  } catch (e) {
    throw e;
  }
}

const actualizarClaveResidenteModel = async (usuario, clave) => {
  const clave_hasheada = await bcrypt.hash(clave, 10);
  const query = "UPDATE residente SET clave_hasheada = $1, fecha_cambio_clave = NOW() WHERE correo = $2";
  const param = [clave_hasheada, usuario];
  try {
    const conexion = await db_pool.query(query, param);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    if (!conexion.rowCount) return false;
    return true;
  } catch (e) {
    throw e;
  }
}

export const rValidarTrabajoModel = async (id) => {
  const query = "UPDATE ticket_residente SET firma_residente_valida = TRUE WHERE id_ticket = $1";
  const param = [id];
  try {
    const conexion = await db_pool.query(query, param);
    if (!conexion) throw new Error("No fue posible realizar la accion");
    if (!conexion.rowCount) return false;
    return true;
  } catch (e) {
    throw e;
  }
}






export {
  actualizarPrimeraClaveResidenteModel,
  loginResidenteModel,
  validarCodigoModel,
  actualizarClaveResidenteModel,
  obtenerInformacionModel,
  registrarClave
};