import express from "express";
import cookieParser from "cookie-parser";
import { empezarTrabajoMantenimiento, finalizarTrabajoMantenimiento, solicitarMantenimiento } from "../../controllers/mantenimientoController/mantenimiento.controller.js";
import { validarTokenUsuario} from "../../helpers/middlewares/validarToken.js";
import { obtenerInformacion, rValidarTrabajo } from "../../controllers/usuarioController/residente.controller.js";
import { reservaPorResidente } from "../../controllers/areasComunesController/area.controler.js";

const router = express.Router();
router.use(cookieParser());


//Obtener informacion residente
router.get('/:id', /* validarTokenUsuario, */ obtenerInformacion);

//Obtener informacion de reservas
router.get('/info-reservas/:id', /* validarTokenUsuario, */ reservaPorResidente);

router.put('/validar-trabajo', rValidarTrabajo);



/* //Solicitar mentanimiento por parte del usuario
router.post('/solicitar-mantenimiento', validarTokenUsuario, solicitarMantenimiento);

//Registrar cuando comienza el trabajo
router.post('/registrar-inicio-mantenimiento', validarTokenUsuario, empezarTrabajoMantenimiento);

//Finalizar el trabajo de mantenimiento
router.put(
  "/finalizar-mantenimiento",
  validarTokenUsuario,
  finalizarTrabajoMantenimiento
);*/

export { router };
