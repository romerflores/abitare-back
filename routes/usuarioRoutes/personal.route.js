import express from "express";
import { pFinalizarTrabajo, pObtenerIncidenteInfo, pObtenerIncidentes } from "../../controllers/usuarioController/personal.controller.js";

export const router = express.Router();


/* El tecnico debe de dar una lista de las herramientas que usó, el tiempo que tardo, en general dar un informe de todos lo que realizo en el mantenimiento de incidente */

router.get("/obtener-registros/:id", pObtenerIncidentes);
router.get("/obtener-registro-info/:id", pObtenerIncidenteInfo);
router.post("/registrar-informe", pFinalizarTrabajo);