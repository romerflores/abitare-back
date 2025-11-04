import { db_pool } from "../../helpers/bdConnection.js";

const validateTimeReserva = (hora_inicio, hora_fin) => {
  if (toMinutes(hora_fin) > toMinutes("23:00") || toMinutes(hora_inicio) < toMinutes("07:00")) {
    throw new Error("Solo se permiten hacer uso del area desde 07:00 hasta las 23:00");
  }


  if (toMinutes(hora_fin) < toMinutes(hora_inicio)) {
    throw new Error("La hora de fin no puede ser menor que la hora de inicio");
  }

  if (toMinutes(hora_fin) - toMinutes(hora_inicio) < 60) {
    throw new Error("La reserva debe ser al menos de 1 hora");
  }
}
//import { db_pool } from "../../helpers/bdConnection.js";
//
//const obtenerAreasModel = async () => {
//  try {
//    const query = "SELECT * FROM area_comun";
//    const response = await db_pool.query(query);
//    if (!response) throw new Error("No fue posible encontrar areas");
//    return response.rows;
//  } catch (e) {
//    throw e;
//  }
//};
//
//const obtenerAreaModel = async (id) => {
//  try {
//    const query = "SELECT * FROM area_comun WHERE id_area = $1";
//    const parameters = [id];
//    const response = await db_pool.query(query, parameters);
//    if (!response.rowCount) throw new Error("No existe el área común buscado");
//    /*
//        if (!response)
//          return res.status(404).json({
//            message: "No se encontraron áreas comunes",
//          }); */
//    return response.rows[0];
//  } catch (e) {
//    throw e;
//  }
//};
//
//const crearAreasModel = async (
//  nombre,
//  descripcion,
//  disponibilidad,
//  tipo,
//  dimension,
//  apertura,
//  cierre,
//  costo,
//  acuerdo
//) => {
//  try {
//    const query =
//      "INSERT INTO area_comun (nombre, descripcion, disponibilidad, tipo, dimension, hora_apertura, hora_cierre, costo_por_hora, acuerdo_uso) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)"; //de estado a disponibilidad
//    const parameters = [
//      nombre.toUpperCase(),
//      descripcion.toUpperCase(),
//      disponibilidad.toUpperCase(),
//      tipo.toUpperCase(),
//      dimension,
//      apertura,
//      cierre,
//      Number(costo),
//      acuerdo
//    ];
//    const response = await db_pool.query(query, parameters);
//    if (!response.rowCount) throw new Error("No se pudo añadir un nuevo área común");
//    return response;
//  } catch (e) {
//    throw new Error("Error al agrearg dbg",e);
//  }
//};
//
//const actualizarAreasModel = async (
//  id,
//  nombre,
//  descripcion,
//  disponibilidad,
//  tipo,
//  dimension,
//  apertura,
//  cierre,
//  costo,
//  acuerdo
//) => {
//  try {
//    const query =
//      "UPDATE area_comun SET nombre = $1, descripcion = $2, disponibilidad = $3, tipo = $4, dimension = $5, hora_apertura = $6, hora_cierre = $7, costo_por_hora = $8 , acuerdo_uso = $9 WHERE id_area = $10";
//    const parameters = [
//      nombre.toUpperCase(),
//      descripcion.toUpperCase(),
//      disponibilidad.toUpperCase(),
//      tipo.toUpperCase(),
//      dimension,
//      apertura,
//      cierre,
//      costo,
//      acuerdo,
//      Number(id),
//    ];
//    const response = await db_pool.query(query, parameters);
//    if (!response.rowCount) throw new Error("No se pudo actualizar");
//    return response;
//  } catch (e) {
//    throw e;
//  }
//};
//
//const eliminarAreasModel = async (id) => {
//  try {
//    const query = "DELETE FROM area_comun WHERE id_area = $1";
//    const parameters = [id];
//    const response = await db_pool.query(query, parameters);
//    if (!response.rowCount) throw new Error("No se pudo eliminar");
//    return response;
//  } catch (e) {
//    throw e;
//  }
//};
//
//const areaDisponible = async (fecha_reserva, hora_inicio, hora_fin) => {
//  const query = "SELECT * FROM verificar_reserva ($1, $2, $3)";
//  const parameters = [fecha_reserva, hora_inicio, hora_fin];
//  try {
//    const response = await db_pool.query(query, parameters);
//    if (!response) throw new Error("No se pudo ejecutar la funcion");
//    return response;
//  } catch (e) {
//    throw e;
//  }
//};
//
//
//const obtenerReservaModel = async (usuario) => {
//  //const query = 'SELECT id_reserva, fecha, hora_inicio, hora_fin, fecha_reserva, costo FROM reserva_area_comun WHERE id_residente = $1 ORDER BY fecha DESC';
//  const query = 'SELECT \
//        r.id_reserva,\
//        r.fecha,\
//        r.hora_inicio, \
//        r.hora_fin, \
//        r.fecha_reserva, \
//        r.costo_total, \
//        a.id_area, \
//        a.nombre AS nombre_area, \
//        a.descripcion, \
//        a.disponibilidad, \
//        a.tipo, \
//        a.dimension, \
//        a.hora_apertura, \
//        a.hora_cierre, \
//        a.costo_por_hora \
//    FROM reserva_area_comun r \
//    INNER JOIN area_comun a ON r.area = a.id_area \
//    WHERE r.residente = $1 \
//    ORDER BY r.fecha DESC;\
//';
//  const parameters = [usuario];
//  try {
//    const response = await db_pool.query(query, parameters);
//    if (!response) throw new Error('Hubo un error al realizar la accion');
//    if (!response.rowCount) return false;
//    return response.rows;
//  } catch (e) {
//    throw e;
//  }
//}
//
//const sumarHoras = (p_hora) => {
//  const [hh, mm] = p_hora.split(":").map(Number);
//
//  let sum = 3600 * hh + mm * 60 + 30 * 60;
//
//  const nh = Math.floor(sum / 3600) % 24;
//  sum = sum % 3600;
//
//  const nm = Math.floor(sum / 60) % 60;
//
//  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
//
//
//}
//
//const toMinutes = (p_hora) => {
//  const [h, m] = p_hora.split(":").map(Number);
//  return h * 60 + m
//}
//
//const reservarAreaModel = async (
//  id_usuario,
//  id_area,
//  fecha_reserva,
//  hora_inicio,
//  hora_fin
//) => {
//
//  if(toMinutes(hora_fin)>toMinutes("23:00") || toMinutes(hora_inicio)<toMinutes("07:00"))
//  {
//    throw new Error("Solo se permiten hacer uso del area desde 07:00 hasta las 23:00");
//  }
//
//
//  if(toMinutes(hora_fin)<toMinutes(hora_inicio))
//  {
//    throw new Error("La hora de fin no puede ser menor que la hora de inicio");
//  }
//
//  if(toMinutes(hora_fin)-toMinutes(hora_inicio)<60)
//  {
//    throw new Error("La reserva debe ser al menos de 1 hora");
//  }
//
//
//
//  hora_fin = sumarHoras(hora_fin)
//  const query =
//    "CALL proc_reservar_area($1, $2, $3, $4, $5)";
//  const parameters = [
//    id_usuario,
//    id_area,
//    fecha_reserva,
//    hora_inicio,
//    hora_fin
//  ];
//  try {
//
//
//
//    const disponibilidad = await areaDisponible(
//      fecha_reserva,
//      hora_inicio,
//      hora_fin
//    );
//    if (disponibilidad.rowCount)
//      throw new Error(
//        "Ya se encuentra una reserva en la fecha y horas establecidas"
//      );
//    const response = await db_pool.query(query, parameters);
//    if (!response) throw new Error("No se pudo reservar el área común");
//    return response;
//  } catch (e) {
//    throw e;
//  }
//};
//
//const editarReservaAreaModel = async (
//  id_reserva,
//  fecha,
//  hora_inicio,
//  hora_fin
//) => {
//  const query = "CALL proc_editar_reserva_area ($1, $2, $3, $4)";
//  const parameters = [id_reserva, fecha, hora_inicio, hora_fin];
//  try {
//    const disponibilidad = await areaDisponible(
//      fecha,
//      hora_inicio,
//      hora_fin
//    );
//    if (disponibilidad.rowCount)
//      throw new Error(
//        "Ya se encuentra una reserva en la fecha y horas establecidas"
//      );
//    const response = await db_pool.query(query, parameters);
//    if (!response) throw new Error("No se pudo reservar el área común");
//    return response;
//  } catch (e) {
//    throw e;
//  }
//};
//
//const eliminarReservaAreaModel = async (id_reserva) => {
//  const query = "DELETE FROM reserva_area_comun WHERE id_reserva = $1";
//  const parameters = [id_reserva];
//  try {
//    const conexion = await db_pool.query(query, parameters);
//    // if (!conexion) throw new Error("No se pudo realizar la accion: Eliminar reserva");
//    return conexion.rowCount;
//  } catch (e) {
//    throw new Error("Error al eliminar la reserva:", e);
//  }
//}
//
//
//const reservaPorResidenteModel = async (id) => {
//  const query = "SELECT r.id_reserva, r.fecha, r.hora_inicio, r.hora_fin, r.costo, a.nombre, a.descripcion FROM reserva_area_comun r JOIN area_comun a ON r.id_area = a.id_area WHERE id_residente = $1";
//  const parameters = [id];
//  try {
//    const conexion = await db_pool.query(query, parameters);
//    if (!conexion) throw new Error("No se pudo conectar con el servicio");
//    return conexion.rows;
//  } catch (e) {
//    throw e;
//  }
//}
//
//
//
//
//
//
//export {
//  obtenerAreasModel,
//  obtenerAreaModel,
//  crearAreasModel,
//  actualizarAreasModel,
//  eliminarAreasModel,
//  obtenerReservaModel,
//  reservarAreaModel,
//  editarReservaAreaModel,
//  eliminarReservaAreaModel,
//  reservaPorResidenteModel,
//};

//import { db_pool } from "../../helpers/bdConnection.js";

const obtenerAreasModel = async () => {
  try {
    const query = "SELECT * FROM area_comun";
    const response = await db_pool.query(query);
    if (!response) throw new Error("No fue posible encontrar areas");
    return response.rows;
    /* const estados = ["ACTIVO", "INACTIVO"];
    const areasActivas = [];
    const areasInactivas = [];

    response.rows.forEach((area) => {
      if (area.estado.toUpperCase() == estados[0]) areasActivas.push(area);
      else areasInactivas.push(area);
    });

    return { areasActivas, areasInactivas }; */
  } catch (e) {
    throw e;
  }
};

const obtenerAreaModel = async (id) => {
  try {
    const query = "SELECT * FROM area_comun WHERE id_area = $1";
    const parameters = [id];
    const response = await db_pool.query(query, parameters);
    if (!response.rowCount) throw new Error("No existe el área común buscado");
    /* 
        if (!response)
          return res.status(404).json({
            message: "No se encontraron áreas comunes",
          }); */
    return response.rows[0];
  } catch (e) {
    throw e;
  }
};

const crearAreasModel = async (
  nombre,
  descripcion,
  disponibilidad,
  tipo,
  dimension,
  apertura,
  cierre,
  costo,
  acuerdo
) => {
  try {
    const query =
      "INSERT INTO area_comun (nombre, descripcion, disponibilidad, tipo, dimension, hora_apertura, hora_cierre, costo_por_hora, acuerdo_uso) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)"; //de estado a disponibilidad
    const parameters = [
      nombre.toUpperCase(),
      descripcion.toUpperCase(),
      disponibilidad.toUpperCase(),
      tipo.toUpperCase(),
      dimension,
      apertura,
      cierre,
      Number(costo),
      acuerdo,
    ];
    const response = await db_pool.query(query, parameters);
    if (!response.rowCount)
      throw new Error("No se pudo añadir un nuevo área común");
    return response;
  } catch (e) {
    throw new Error("Error al agrearg dbg", e);
  }
};

const actualizarAreasModel = async (
  id,
  nombre,
  descripcion,
  disponibilidad,
  tipo,
  dimension,
  apertura,
  cierre,
  costo,
  acuerdo
) => {
  try {
    const query =
      "UPDATE area_comun SET nombre = $1, descripcion = $2, disponibilidad = $3, tipo = $4, dimension = $5, hora_apertura = $6, hora_cierre = $7, costo_por_hora = $8 , acuerdo_uso = $9 WHERE id_area = $10";
    const parameters = [
      nombre.toUpperCase(),
      descripcion.toUpperCase(),
      disponibilidad.toUpperCase(),
      tipo.toUpperCase(),
      dimension,
      apertura,
      cierre,
      costo,
      acuerdo,
      Number(id),
    ];
    const response = await db_pool.query(query, parameters);
    if (!response.rowCount) throw new Error("No se pudo actualizar");
    return response;
  } catch (e) {
    throw e;
  }
};

const eliminarAreasModel = async (id) => {
  try {
    const query = "DELETE FROM area_comun WHERE id_area = $1";
    const parameters = [id];
    const response = await db_pool.query(query, parameters);
    if (!response.rowCount) throw new Error("No se pudo eliminar");
    return response;
  } catch (e) {
    throw e;
  }
};

const areaDisponible = async (fecha_reserva, hora_inicio, hora_fin) => {
  const query = "SELECT * FROM verificar_reserva ($1, $2, $3)";
  const parameters = [fecha_reserva, hora_inicio, hora_fin];
  try {
    const response = await db_pool.query(query, parameters);
    if (!response) throw new Error("No se pudo ejecutar la funcion");
    return response;
  } catch (e) {
    throw e;
  }
};

const obtenerReservaModel = async (usuario) => {
  //const query = 'SELECT id_reserva, fecha, hora_inicio, hora_fin, fecha_reserva, costo FROM reserva_area_comun WHERE id_residente = $1 ORDER BY fecha DESC';
  const query =
    "SELECT \
        r.id_reserva,\
        r.fecha,\
        r.hora_inicio, \
        r.hora_fin, \
        r.fecha_reserva, \
        r.costo_total, \
        r.pagado,\
        r.url_pago,\
        a.id_area, \
        a.nombre AS nombre_area, \
        a.descripcion, \
        a.disponibilidad, \
        a.tipo, \
        a.dimension, \
        a.hora_apertura, \
        a.hora_cierre, \
        a.costo_por_hora \
    FROM reserva_area_comun r \
    INNER JOIN area_comun a ON r.area = a.id_area \
    WHERE r.residente = $1 \
    ORDER BY r.fecha DESC;\
";
  const parameters = [usuario];
  try {
    const response = await db_pool.query(query, parameters);
    if (!response) throw new Error("Hubo un error al realizar la accion");
    // if (response.rowCount) throw new Error('No tiene reservas');
    return response.rows;
  } catch (e) {
    throw e;
  }
};

const obtenerReservaModelAll = async () => {
  //const query = 'SELECT id_reserva, fecha, hora_inicio, hora_fin, fecha_reserva, costo FROM reserva_area_comun WHERE id_residente = $1 ORDER BY fecha DESC';
  const query =
    "SELECT \
        r.id_reserva,\
        r.fecha,\
        r.hora_inicio, \
        r.hora_fin, \
        r.fecha_reserva, \
        r.costo_total, \
        a.id_area, \
        a.nombre AS nombre_area, \
        a.descripcion, \
        a.disponibilidad, \
        a.tipo, \
        a.dimension, \
        a.hora_apertura, \
        a.hora_cierre, \
        a.costo_por_hora \
    FROM reserva_area_comun r \
    INNER JOIN area_comun a ON r.area = a.id_area \
    ORDER BY r.fecha DESC;\
";
  try {
    const response = await db_pool.query(query);
    if (!response) throw new Error("Hubo un error al realizar la accion");
    // if (response.rowCount) throw new Error('No tiene reservas');
    return response.rows;
  } catch (e) {
    throw e;
  }
};

const sumarHoras = (p_hora) => {
  const [hh, mm] = p_hora.split(":").map(Number);

  let sum = 3600 * hh + mm * 60 + 30 * 60;

  const nh = Math.floor(sum / 3600) % 24;
  sum = sum % 3600;

  const nm = Math.floor(sum / 60) % 60;

  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
};

const toMinutes = (p_hora) => {
  const [h, m] = p_hora.split(":").map(Number);
  return h * 60 + m;
};

const reservarAreaModel = async (
  id_usuario,
  id_area,
  fecha_reserva,
  hora_inicio,
  hora_fin
) => {





  hora_fin = sumarHoras(hora_fin)
  const query =
    "CALL proc_reservar_area($1, $2, $3, $4, $5)";
  const parameters = [
    id_usuario,
    id_area,
    fecha_reserva,
    hora_inicio,
    hora_fin
  ];
  try {

    validateTimeReserva(hora_inicio,hora_fin);

    const disponibilidad = await areaDisponible(
      fecha_reserva,
      hora_inicio,
      hora_fin
    );
    if (disponibilidad.rowCount)
      throw new Error(
        "Ya se encuentra una reserva en la fecha y horas establecidas"
      );
    const response = await db_pool.query(query, parameters);
    if (!response) throw new Error("No se pudo reservar el área común");
    return response;
  } catch (e) {
    throw e;
  }
};

const editarReservaAreaModel = async (
  id_reserva,
  fecha,
  hora_inicio,
  hora_fin
) => {
  const query = "CALL proc_editar_reserva_area ($1, $2, $3, $4)";
  const parameters = [id_reserva, fecha, hora_inicio, hora_fin];
  try {
    const disponibilidad = await areaDisponible(fecha, hora_inicio, hora_fin);
    if (disponibilidad.rowCount)
      throw new Error(
        "Ya se encuentra una reserva en la fecha y horas establecidas"
      );
    const response = await db_pool.query(query, parameters);
    if (!response) throw new Error("No se pudo reservar el área común");
    return response;
  } catch (e) {
    throw e;
  }
};

const eliminarReservaAreaModel = async (id_reserva) => {
  const query = "DELETE FROM reserva_area_comun WHERE id_reserva = $1";
  const parameters = [id_reserva];
  try {
    const conexion = await db_pool.query(query, parameters);
    // if (!conexion) throw new Error("No se pudo realizar la accion: Eliminar reserva");
    return conexion.rowCount;
  } catch (e) {
    throw new Error("Error al eliminar la reserva:", e);
  }
};

const reservaPorResidenteModel = async (id) => {
  const query =
    "SELECT r.id_reserva, r.fecha, r.hora_inicio, r.hora_fin, r.costo, a.nombre, a.descripcion FROM reserva_area_comun r JOIN area_comun a ON r.id_area = a.id_area WHERE id_residente = $1";
  const parameters = [id];
  try {
    const conexion = await db_pool.query(query, parameters);
    if (!conexion) throw new Error("No se pudo conectar con el servicio");
    return conexion.rows;
  } catch (e) {
    throw e;
  }
};


const obtenerComprobantes = async(id)=>
{

}


const registrarComprobanteModel= async(id)=>
{

}

const pagarReservaModel = async (id_reserva, url_comprobante) => {
  const query = `
    UPDATE reserva_area_comun
    SET pagado = TRUE,
        fecha_pago = NOW(),
        url_pago = $2
    WHERE id_reserva = $1;
  `;
  const params = [id_reserva, url_comprobante];

  try {
    const result = await db_pool.query(query, params);
    return result.rowCount > 0;
  } catch (e) {
    throw e;
  }
};


export {
  obtenerAreasModel,
  obtenerAreaModel,
  crearAreasModel,
  actualizarAreasModel,
  eliminarAreasModel,
  obtenerReservaModel,
  reservarAreaModel,
  editarReservaAreaModel,
  eliminarReservaAreaModel,
  reservaPorResidenteModel,
  obtenerReservaModelAll,
  obtenerComprobantes,
  registrarComprobanteModel,
  pagarReservaModel
};
