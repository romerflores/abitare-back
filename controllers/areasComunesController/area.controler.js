import { validarFechaReserva } from "../../helpers/funciones/validador.js";
import {
  actualizarAreasModel,
  crearAreasModel,
  editarReservaAreaModel,
  eliminarAreasModel,
  eliminarReservaAreaModel,
  obtenerAreaModel,
  obtenerAreasModel,
  obtenerReservaModel,
  obtenerReservaModelAll,
  reservaPorResidenteModel,
  reservarAreaModel,
  registrarComprobanteModel,
  pagarReservaModel
} from "../../models/areasComunesModel/area.model.js";

import path from "path"
import fs from "fs"

const obtenerAreas = async (req, res) => {
  try {
    /*     const { areasActivas, areasInactivas } = await obtenerAreasModel(); */
    const respuesta = await obtenerAreasModel();
    return res.status(200).json({
      message: "Áreas comunes",
      datos: respuesta,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const obtenerArea = async (req, res) => {
  const id = req.params.id.slice(1);
  try {
    const response = await obtenerAreaModel(id);
    if (!response)
      return res.status(404).json({
        message: "Hubo un error al obtener el área",
      });

    return res.status(200).json({
      message: "Área comun",
      datos: response,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const crearArea = async (req, res) => {
  const estados = ["HABILITADO", "DESHABILITADO", "REPARACION"];

  const { nombre, descripcion, disponibilidad, tipo, dimension, apertura, cierre, costo, acuerdo } = req.body;

  if (
    !nombre ||
    !descripcion ||
    !disponibilidad ||
    !tipo ||
    !dimension ||
    !apertura ||
    !cierre ||
    !costo ||
    !acuerdo
  )
    return res.status(400).json({
      message: "Debe ingresar todos los datos necesario",
    });
  if (!estados.includes(disponibilidad))
    return res.status(400).json({
      message: "El estado del área común no es correcto xd",
    });
  try {
    const response = await crearAreasModel(
      nombre,
      descripcion,
      disponibilidad,
      tipo,
      dimension,
      apertura,
      cierre,
      costo,
      acuerdo
    );
    if (!response.rowCount)
      return res.status(400).json({
        message: "No se creó un nuevo área",
      });
    return res.status(200).json({
      message: "El área común fue creado de forma exitosa",
      datos: response.rows,
    });
  } catch (e) {
    if (e.code == 23505)
      return res.status(400).json({
        message: "El área común ya existe",
      });
    if (e.code == 22007)
      return res.status(400).json({
        message:
          "La hora de apertura o de cierre debe tener el formato HH:MM:SS",
      });
    return res.status(500).json({
      message: e.message,
    });
  }
};

const actualizarAreas = async (req, res) => {
  const { id, nombre, descripcion, disponibilidad, tipo, dimension, apertura, cierre, costo, acuerdo } = req.body;
  console.log(id, nombre, descripcion, disponibilidad, tipo, dimension, apertura, cierre, costo, acuerdo)
  if (
    !id ||
    !nombre ||
    !descripcion ||
    !disponibilidad ||
    !tipo ||
    !dimension ||
    !apertura ||
    !cierre ||
    !costo ||
    acuerdo == null
  )
    return res.status(400).json({
      message: "Debe ingresar todos los datos a actualizar",
    });
  try {
    const response = await actualizarAreasModel(
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
    );
    if (!response.rowCount)
      return res.status(400).json({
        message: "No se actualizaron los datos",
      });
    return res.status(200).json({
      message: "El área común fue actualizado de forma exitosa",
      datos: response.rows[0],
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

const eliminarArea = async (req, res) => {
  const id = req.params.id;//.slice(1)
  try {
    const response = await eliminarAreasModel(id);
    if (!response.rowCount)
      return res.status(400).json({
        message: "No se pudo eliminar el área seleccionada",
      });
    return res.status(200).json({
      message: "El área común se eliminò con èxito",
      datos: response.rows,
    });
  } catch (e) {
    console.log(e);
    if (e.message == "update o delete en «area_comun» viola la llave foránea «reserva_area_comun_area_fkey» en la tabla «reserva_area_comun»") {
      return res.status(400).json(
        {
          message: "No se puede borrar por que tiene reservas en curso",
        }
      )
    }
    return res.status(500).json({
      message: e.message,
    });
  }
};


const obtenerReservas = async (req, res) => {
  if (!req.params.id_usuario) return res.status(400).json({
    message: 'Ingrese el usuario correspondiente'
  });
  const usuario = req.params.id_usuario.slice(1);
  try {
    const response = await obtenerReservaModel(usuario);
    if (response) return res.status(200).json({
      message: 'Reservas',
      datos: response
    })
    return res.status(404).json({
      message: 'No se encontraron reservas'
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
}

const obtenerReservasAll = async (req, res) => {

  try {
    const response = await obtenerReservaModelAll();
    if (response) return res.status(200).json({
      message: 'Reservas',
      datos: response
    })
    return res.status(404).json({
      message: 'No se encontraron reservas'
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const reservarArea = async (req, res) => {
  const { usuario, id_area, fecha, inicio, fin, acuerdo } = req.body;
  if (!acuerdo) {
    return res.status(400).json(
      {
        message: "Debe aceptar el acuerdo de uso para usar esta area"
      }
    )
  }

  if ((!usuario || !id_area || !fecha || !inicio || !fin))
    return res.status(400).json({
      message: "Debe llenar todos los datos"
    });
  try {
    const response = await reservarAreaModel(
      usuario,
      id_area,
      fecha,
      inicio,
      fin
    );
    if (!response)
      return res.status(400).json({
        message: "No se pudo reservar el área común",
      });
    return res.status(201).json({
      message: "Fue posible reservar el área común",
    });
  } catch (e) {
    if (e.code == 23503) return res.status(400).json({
      message: "El id del usuario ingresado no existe"
    })
    return res.status(500).json({
      message: e.message,
    });
  }
};

const editarReservaArea = async (req, res) => {
  const { id_reserva, fecha, inicio, fin } = req.body;

  if (!id_reserva || !fecha || !inicio || !fin)
    return res.status(400).json({
      message: "Debe llenar todos los datos",
    });
  try {
    const response = await editarReservaAreaModel(id_reserva, fecha, inicio, fin);
    if (!response)
      return res.status(400).json({
        message: "No se pudo modificar la reserva ",
      });
    return res.status(201).json({
      message: "Se modificó la reserva",
    });
  } catch (e) {
    if (e.code == 22008) return res.status(400).json({
      message: "Fecha fuera de rango, ingrese una fecha válida"
    });
    if (e.code == 23503)
      return res.status(400).json({
        message: "El id del usuario ingresado no existe",
      });
    return res.status(500).json({
      message: e.message,
    });
  }
};


/**
 * Pago de reservas:
 */


const pagarReserva = async (req, res) => {
  const { id_reserva } = req.body;
  const archivo = req.file;


  if (!id_reserva || !archivo)
    return res.status(400).json({
      message: "Debe enviar el id de la reserva y el comprobante de pago.",
    });

  try {
    // Generar nombre único
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const nombreArchivo = `comp_${id_reserva}_${timestamp}${path.extname(archivo.originalname)}`;

    // Crear carpeta si no existe
    const carpetaDestino = path.join(process.cwd(), "comprobantes");
    if (!fs.existsSync(carpetaDestino)) fs.mkdirSync(carpetaDestino, { recursive: true });

    // Ruta final del archivo
    const rutaFinal = path.join(carpetaDestino, nombreArchivo);

    // Mover archivo desde temporal a comprobantes
    fs.renameSync(archivo.path, rutaFinal);

    // Guardar en base de datos
    const urlArchivo = `/comprobantes/${nombreArchivo}`;
    const exito = await pagarReservaModel(id_reserva, urlArchivo);

    if (!exito)
      return res.status(400).json({
        message: "No se pudo registrar el pago, intente nuevamente.",
      });

    return res.status(201).json({
      message: "Pago registrado correctamente.",
      comprobante: urlArchivo,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};


export const obtenerComprobantes = async (req, res) => {
  try {
    const { id_reserva } = req.params;
    const comprobantes = await obtenerComprobantesModel(id_reserva);
    return res.status(200).json(comprobantes);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};






const eliminarReservaArea = async (req, res) => {
  const id = req.params.id.slice(1) || req.params.id;
  try {
    const respuesta = await eliminarReservaAreaModel(id);
    if (!respuesta) return res.status(400).json({
      message: "No fue posible eliminar su reserva"
    })
    return res.status(200).json({
      message: "Su reserva fue eliminada"
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message
    });
  }
};


const reservaPorResidente = async (req, res) => {
  const id = req.params.id.slice(1);
  try {
    const respuesta = await reservaPorResidenteModel(id);
    if (!respuesta) return res.status(404).json({
      message: "Usted no hizo ninguna reserva"
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


export { obtenerAreas, obtenerArea, crearArea, actualizarAreas, eliminarArea, obtenerReservas, reservarArea, editarReservaArea, eliminarReservaArea, reservaPorResidente, obtenerReservasAll ,pagarReserva};
