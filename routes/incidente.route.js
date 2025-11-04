import express from "express";
import multer from "multer";/* 
import path from "node:path";
import { fileURLToPath } from "node:url"; */

import { obtenerImagenesTicket, obtenerIncidenteId, obtenerIncidentes, obtenerNivel, registrarIncidente } from "../controllers/incidenteController/incidente.controller.js";

const router = express.Router();
const upload = multer({ dest: './files' });
/* 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); */

router.get("/niveles", obtenerNivel);
router.get('/incidentes-registrados/:id', obtenerIncidentes);
router.get("/informacion-incidente/:id", obtenerIncidenteId);
router.post("/registrar-incidente", upload.array("files", 5), registrarIncidente);
router.get("/imagenes-ticket/:id", obtenerImagenesTicket);

/* router.use("/public/images", express.static(path.join(__dirname, 'files'))); */

export { router };
