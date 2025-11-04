import fs from "node:fs";
import {
  obtenerNivelModel,
  obtenerIncidentesModel,
  registrarIncidenteModel,
  obtenerIncidenteIdModel,
  obtenerImagenesTicketModel,
} from "../../models/incidenteModel/incidente.model.js";
import { enviarCorreo } from "../../helpers/funciones/enviarEmail.js";

export const obtenerNivel = async (req, res) => {
  try {
    const respuesta = await obtenerNivelModel();
    if (respuesta)
      return res.status(200).json({
        message: "Niveles",
        niveles: respuesta,
      });
    return res.status(404).json({
      message: "No se encontraron niveles",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const registrarIncidente = async (req, res) => {
  req.files.map(saveFile);
  const { titulo, descripcion, nivel, ubicacion, tipo_incidente } = req.body;
  if (!titulo || !descripcion || !nivel || !ubicacion || !tipo_incidente)
    return res.status(400).json({
      message: "Son obligatorios los campos de texto",
    });
  const residente = 93913425;
  const archivos = req.files;
  try {
    const respuesta = await registrarIncidenteModel(
      titulo,
      descripcion,
      tipo_incidente,
      residente,
      ubicacion,
      nivel,
      archivos
    );
    if (!respuesta) return res.status(400).json({
        message:
          "El incidente no pudo ser registrado, si es Urgente, comuniquese con un administrador",
    });
    /* enviarCorreo(
      "aavalosc@fcpn.edu.bo",
      "alexitoavallejas@gmail.com",
      `Registro de incidente ${titulo}`,
      `El residente con codigo ${residente} registró un nuevo incidente en el edificio con las siguientes caracteristicas:
        descripcion: ${descripcion}
        tipo de incidente: ${tipo_incidente}
        ubicacion: ${ubicacion}
      Se espera que asigne el personal adecuado.`
    ); */
    return res.status(201).json({
      message: "El incidente fue registrado, espere al administrador",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const obtenerIncidentes = async (req, res) => {
  const id = req.params.id.slice(1) || req.params.id;
  try {
    const respuesta = await obtenerIncidentesModel(id);
    if (respuesta)
      return res.status(200).json({
        message: "Incidentes registados",
        incidentes: respuesta,
      });
    return res.status(404).json({
      message: "No hay incidentes registrados",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const obtenerIncidenteId = async (req, res) => {
  const id = req.params.id.slice(1) || req.params.id;
  try {
    const respuesta = await obtenerIncidenteIdModel(id);
    if (respuesta)
      return res.status(200).json({
        message: "Informacion incidente",
        incidente: respuesta,
      });
    return res.status(404).json({
      message: "No se pudo encontrar informacion de este incidente",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const obtenerImagenesTicket = async (req, res) => {
  const id = req.params.id.slice(1);
  try {
    const respuesta = await obtenerImagenesTicketModel(id);
    if (!respuesta) return res.status(404).json({
      message: "No hay imagenes sobre este incidente"
    });
    return res.status(200).json({
      message: "Imagenes",
      imagenes: respuesta
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    })
  }
}





/* Funciones complementarias */
function saveFile(file) {
  const newPath = `./files/${file.originalname}`;
  fs.renameSync(file.path, newPath);
  return newPath;
}
