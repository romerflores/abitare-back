import { enviarCorreo } from "../../helpers/funciones/enviarEmail.js";
import { pFinalizarTrabajoModel, pObtenerIncidenteInfoModel, pObtenerIncidentesModel } from "../../models/personal.model.js";

export const pObtenerIncidentes = async (req, res) => {
  const id = req.params.id || req.params.id.slice(1);
  try {
    const respuesta = await pObtenerIncidentesModel(id);
    if (!respuesta) return res.status(404).json({
      message: "No se encontraron incidentes registrados para usted"
    });
    return res.status(200).json({
      message: "Incidentes registrados",
      incidentes: respuesta
    })
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message
    });
  }
};

export const pObtenerIncidenteInfo = async (req, res) => {
  const id = req.params.id || req.params.id.slice(1);
  try {
    const respuesta = await pObtenerIncidenteInfoModel(id);
    if (!respuesta)
      return res.status(404).json({
        message: "No se encontraron incidentes registrados para usted",
      });
    return res.status(200).json({
      message: "Datos del incidente",
      incidente: respuesta,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const pFinalizarTrabajo = async (req, res) => {
  const { ticket, tecnico, resumen, anterior, extra } = req.body;
  if (!ticket || !tecnico || !resumen || !anterior) return res.status(400).json({
    message: "Debe de brindar como mínimo un resumen de su trabajo al igual de como encontró el incidente"
  });
  try {
    const respuesta = await pFinalizarTrabajoModel(ticket, resumen, anterior, tecnico, extra);
    if (!respuesta) return res.status(400).json({
      message: "No fue posible registrar su informe"
    });
    return res.status(201).json({
      message: "Su informe fue registrado"
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
}
