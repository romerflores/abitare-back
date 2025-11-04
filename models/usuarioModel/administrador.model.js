import bcrypt from "bcrypt";
import { db_pool } from "../../helpers/bdConnection.js";
import { generarID } from "../../helpers/funciones/generador.js";

export const loginAdministradorModel = async (usuario, clave, codigo) => {
  const query =
    "SELECT id_administrador, nombre, paterno, materno, correo, clave_hasheada FROM administrador WHERE correo = $1";
  const parameters = [usuario];
  const queryRegistro =
    "INSERT INTO inicio_sesion (correo_residente, fecha_inicio, codigo_inicio) VALUES ($1, NOW(), $2)";
  const parametersRegistro = [usuario, codigo];
  try {
    const response = await db_pool.query(query, parameters);
    if (!response.rowCount) throw new Error("El usuario no existe");
    const claveResponse = response.rows[0].clave_hasheada;
    if (!(await bcrypt.compare(clave, claveResponse)))
      throw new Error("Contraseña incorrecta");
    const responseRegistro = await db_pool.query(
      queryRegistro,
      parametersRegistro
    );
    const administrador = response.rows[0];
    delete administrador.clave_hasheada;
    return administrador;
  } catch (e) {
    throw e;
  }
};

export const actualizarPrimeraClaveAdminModel = async (id, clave) => {
  const query = "UPDATE administrador SET clave_hasheada = $1, fecha_cambio_clave = NOW() WHERE id_administrador = $2";
  const clave_hasheada = await bcrypt.hash(clave, 10);
  const parameters = [clave_hasheada, id];
  try {
    const response = await db_pool.query(query, parameters);
    if (!response.rowCount) throw new Error('No se pudo actualizar, el usuario no pudo actualizarse');
    return true;
  } catch(e){
    throw e;
  }
}

export const registrarClaveAdmin = async (usuario, codigo) => {
  const queryUsuario = "SELECT 1 FROM administrador WHERE correo = $1";
  const paramUsuario = [usuario];
  const queryClave =
    "INSERT INTO cambio_contrasenia (usuario, fecha_cambio, codigo_email) VALUES ($1, NOW(), $2)";
  const paramClave = [usuario, codigo];
  try {
    const conexionUsuario = await db_pool.query(queryUsuario, paramUsuario);
    if (!conexionUsuario)
      throw new Error("No se pudo realizar la accion: obtener usuario");
    if (!conexionUsuario.rowCount) return false;
    const conexionClave = await db_pool.query(queryClave, paramClave);
    if (!conexionClave)
      throw new Error("No se pudo realizar la accion: registrar codigo");
    return true;
  } catch (e) {
    throw e;
  }
};

export const actualizarClaveAdministradorModel = async (usuario, clave) => {
  const clave_hasheada = await bcrypt.hash(clave, 10);
  const query =
    "UPDATE administrador SET clave_hasheada = $1, fecha_cambio_clave = NOW() WHERE correo = $2";
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


export const registrarResidenteModel = async (
  nombre,
  paterno,
  materno,
  correo,
  ci,
  fecha_nacimiento,
  clave,
  tipo,
  dpto
) => {
  const id_residente = generarID();
  const clave_hasheada = await bcrypt.hash(clave, 10);
  const query =
    "INSERT INTO residente VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE, NOW(), NOW(), NOW(), $9, $10, 'ACTIVO')";
  const parameters = [
    id_residente,
    nombre.toUpperCase(),
    paterno.toUpperCase(),
    materno.toUpperCase(),
    correo,
    ci,
    fecha_nacimiento,
    clave_hasheada,
    tipo,
    dpto,
  ];
  try {
    const response = await db_pool.query(query, parameters);
    if (!response.rowCount)
      throw new Error("Hubo un error al registrar el nuevo usuario");
    return true;
  } catch (e) {
    throw e;
  }
};

export const registrarAdminModel = async (
  nombre,
  paterno,
  materno,
  correo,
  ci,
  clave,
  fecha
) => {
  const id_residente = generarID();
  const clave_hasheada = await bcrypt.hash(clave, 10);
  const query =
    "INSERT INTO administrador VALUES ($1, $2, $3, $4, $5, $6, false, NOW(), NOW(), NOW(), $7, $8)";
  const parameters = [
    id_residente,
    nombre.toUpperCase(),
    paterno.toUpperCase(),
    materno.toUpperCase(),
    correo,
    clave_hasheada,
    ci,
    fecha,
  ];
  try {
    const response = await db_pool.query(query, parameters);
    if (!response.rowCount)
      throw new Error("Hubo un error al registrar el nuevo usuario");
    return true;
  } catch (e) {
    throw e;
  }
};

export const obtenerResidentesModel = async () => {
  const query =
    "SELECT id_residente, nombre, paterno, materno, correo, ci, id_departamento FROM residente WHERE estado_activo = 'ACTIVO' ORDER BY id_departamento";
  try {
    const conexion = await db_pool.query(query);
    if (!conexion) throw new Error("No fue posible realizar la accion");
    return conexion.rows;
  } catch (e) {
    throw e;
  }
};

export const obtenerResidenteIdModel = async (id) => {
  const query =
    "SELECT id_residente, nombre, paterno, materno, correo, ci, fecha_nacimiento, tipo_residente, id_departamento FROM residente WHERE id_residente = $1 AND estado_activo = 'ACTIVO' ";
  const parameters = [id];
  try {
    const conexion = await db_pool.query(query, parameters);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    return conexion.rows[0];
  } catch (e) {
    throw e;
  }
};

export const actualizarResidenteModel = async (
  nombre,
  paterno,
  materno,
  correo,
  ci,
  fecha,
  tipo,
  dpto,
  usuario
) => {
  const query =
    "UPDATE residente SET nombre=$1, paterno=$2, materno=$3, correo=$4, ci=$5, fecha_nacimiento=$6, fecha_actu_datos = NOW(), tipo_residente = $7, id_departamento=$8 WHERE id_residente = $9";
  const parameters = [
    nombre,
    paterno,
    materno,
    correo,
    ci,
    fecha,
    tipo,
    dpto,
    usuario,
  ];
  try {
    const conexion = await db_pool.query(query, parameters);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    return conexion.rowCount;
  } catch (e) {
    throw e;
  }
};

export const eliminarResidenteModel = async (id) => {
  const query = "UPDATE residente SET estado_activo = 'INACTIVO' WHERE id_residente = $1";
  const parameters = [id];
  try {
    const conexion = await db_pool.query(query, parameters);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    return true;
  } catch (e) {
    throw e;
  }
};

//Departamentos
export const obtenerDepartamentosModel = async () => {
  const query = "SELECT * FROM departamento";
  try {
    const conexion = await db_pool.query(query);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    return conexion.rows;
  } catch (e) {
    throw e;
  }
};

//Personal
export const obtenerPersonalModel = async () => {
  const query =
    "SELECT p.id_personal, p.paterno, p.materno, p.nombres, p.ci, p.email, p.celular, t.tipo  FROM personal_mantenimiento pm JOIN personal p ON pm.id_personal = p.id_personal JOIN tipo_mantenimiento t ON pm.id_mantenimiento = t.id_mantenimiento WHERE p.estado_activo = 'ACTIVO' ORDER BY t.tipo";
  try {
    const conexion = await db_pool.query(query);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    return conexion.rows;
  } catch (e) {
    throw e;
  }
};

export const obtenerPersonalIdModel = async (id) => {
  const query =
    "SELECT p.id_personal, p.paterno, p.materno, p.nombres, p.ci, p.salario, p.email, p.celular, p.estado_disponible, p.fecha_contratacion, p.hora_entrada, p.hora_salida, t.tipo  FROM personal_mantenimiento pm JOIN personal p ON pm.id_personal = p.id_personal JOIN tipo_mantenimiento t ON pm.id_mantenimiento = t.id_mantenimiento WHERE p.id_personal = $1 AND p.estado_activo = 'ACTIVO' ";
  const parameters = [id];
  try {
    const conexion = await db_pool.query(query, parameters);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    return conexion.rows[0];
  } catch (e) {
    throw e;
  }
};

export const registrarPersonalModel = async (
  id,
  nombre,
  paterno,
  materno,
  ci,
  celular,
  salario,
  email,
  estado,
  entrada,
  salida, empleo
) => {
  /* const clave_hasheada = await bcrypt.hash(clave, 10); */
  const query =
    "INSERT INTO personal (id_personal, nombres, paterno, materno, ci, celular, salario, email, estado_disponible, hora_entrada, hora_salida, fecha_contratacion, clave_hasheada, estado_activo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), $12, 'ACTIVO')";
  const clave = await bcrypt.hash(ci, 10)
  const parameters = [id, nombre, paterno, materno, ci, celular, salario, email, estado, entrada, salida, clave];
  const queryEmpleo = "INSERT INTO personal_mantenimiento VALUES ($1, $2)";
  const parametersEmpleo = [id, empleo]
  try {
    const response = await db_pool.query(query, parameters);
    if (!response) throw new Error("No se pudo realizar la accion: Registrar personal");
    const responseEmpleo = db_pool.query(queryEmpleo, parametersEmpleo);
    if (!responseEmpleo) throw new Error("No se pudo realizar la accion: Relacionar empleador");
    return true;
  } catch (e) {
    throw e;
  }
};


export const actualizarPersonalModel = async (
  usuario,
  nombre,
  paterno,
  materno,
  ci,
  celular,
  salario,
  email,
  estado,
  entrada,
  salida
) => {
  const query =
    "UPDATE personal SET nombres=$1, paterno=$2, materno=$3, ci=$4, celular=$5, salario=$6, email=$7, estado_disponible = $8, hora_entrada = $9, hora_salida = $10, fecha_actualizacion = NOW() WHERE id_personal = $11";
  const parameters = [nombre, paterno, materno, ci, celular, salario, email, estado, entrada, salida, usuario];
  try {
    const conexion = await db_pool.query(query, parameters);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    return conexion.rowCount;
  } catch (e) {
    throw e;
  }
};

export const eliminarPersonalmodel = async (id) => {
  const query = "UPDATE personal SET estado_activo = 'INACTIVO' WHERE id_personal = $1";
  const parameters = [id];
  try {
    const conexion = await db_pool.query(query, parameters);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    return true;
  } catch (e) {
    throw e;
  }
};


export const registrarVisitaModel = async (ci, nombre, paterno, materno, dpto, asunto) => {
  const queryRegistro = "INSERT INTO registro_visita (departamento, ci_visitante, nombre, paterno, materno, descripcion, fecha_entrada) VALUES ($1,$2,$3,$4,$5,$6,NOW())";
  const parametersRegistro = [dpto, ci, nombre, paterno, materno, asunto];
  try {
    const conexionRegistro = await db_pool.query(queryRegistro, parametersRegistro);
    if (!conexionRegistro) throw new Error("No se pudo realizar la accion: Registrar visita");
    return conexionRegistro.rows
  } catch (e) {
    throw e;
  }
}

export const obtenerRegistroVisitasModel = async () => {
  let activos = [];
  let inactivos = [];
  const query = "SELECT * FROM registro_visita ORDER BY fecha_entrada DESC";
  try {
    const conexion = await db_pool.query(query);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    const registros = conexion.rows;
    registros.forEach(registro => {
      if (!registro) inactivos.push(registro);
      else activos.push(registro);
    });
    return {activos, inactivos}
  } catch (e) {
    throw e;
  }
}

/* Mantenimiento e incidentes */

export const aObtenerIncidentesModel = async () => {
  const query = "SELECT * FROM func_obtener_incidentes_tabla_admin()";
  try {
    const respuesta = await db_pool.query(query);
    if (!respuesta) throw new Error("No se pudo realizar la accion");
    if (!respuesta.rowCount) return false;
    return respuesta.rows;
  } catch (e) {
    throw e;
  }
}

export const aObtenerIncidenteIdModel = async (id) => {
  const query = "SELECT * FROM func_obtener_incidentes_id_admin($1)";
  const param = [id];
  try {
    const respuesta = await db_pool.query(query, param);
    if (!respuesta) throw new Error("No se pudo realizar la accion");
    if (!respuesta.rowCount) return false;
    return respuesta.rows[0];
  } catch (e) {
    throw e;
  }
};

export const aObtenerPersonalPorTipoModel = async (tipo_mantenimiento) => {
  const query = "SELECT * FROM func_admin_obtener_personal_mantenimiento($1)";
  const params = [tipo_mantenimiento];
  try {
    const conexion = await db_pool.query(query, params);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    if (!conexion.rowCount) return false;
    return conexion.rows;
  } catch (e) {
    throw e;
  }
}


export const aAsignarPersonalModel = async (ticket_id, tecnico_id) => {
  const query = "CALL proc_asignar_tecnico($1, $2)";
  const params = [ticket_id, tecnico_id];
  try {
    const conexion = await db_pool.query(query, params);
    if (!conexion) throw new Error("No se pudo realizar la accion");
    return true;
  } catch (e) {
    throw e;
  }
}