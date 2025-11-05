import express from "express";
import cookieParser from "cookie-parser";
import {
  actualizarAreas,
  crearArea,
  editarReservaArea,
  eliminarArea,
  eliminarReservaArea,
  obtenerArea,
  obtenerAreas,
  obtenerReservas,
  obtenerReservasAll,
  reservarArea,
  pagarReserva
} from "../../controllers/areasComunesController/area.controler.js";
import { validarTokenAdmin, validarTokenUsuario } from "../../helpers/middlewares/validarToken.js";
import multer from "multer";


const router = express.Router();

router.use(cookieParser());

/**
 * @openapi
 *  /api/area-comun/:
 *    get:
 *      summary: Ver todas las areas comunes habilitadas
 *      description: Regresa todas las areas comunes registradas
 *      tags:
 *        - Area-comun   
 *      responses:
 *        '200':
 *          description: Conjunto de todas las areas comunes registradas 
 *        '404':
 *          description: No hay areas comunes registradas
 */

/**
 * @openapi
 *  /api/area-comun/obtener-area/:{id}:
 *    get:
 *      summary: Ver el área comun específica
 *      description: Regresa todos los datos de un área común en específico
 *      tags:
 *        - Area-comun
 *      parameters:
 *        -
 *          in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: number
 *          description: ID del usuario   
 *      responses:
 *        '200':
 *          description: Conjunto de todas las areas comunes registradas 
 *        '404':
 *          description: No hay areas comunes registradas
 */

/**
 * @openapi
 *  /api/area-comun/crear:
 *    post:
 *      summary: Registrar un area comun
 *      description: Devuelve un mensaje de aceptación o de negación
 *      tags:
 *        - Area-comun-administrador
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - nombre
 *                - descripcion
 *                - estado
 *                - tipo
 *                - dimension
 *                - apertura
 *                - cierre
 *              properties:
 *                nombre:
 *                  type: string
 *                  description: Nombre del area comun
 *                descripcion:
 *                  type: string
 *                  description: Descripcion del area comun
 *                estado:
 *                  type: string
 *                  description: Estado del area comun (ACTIVO, INACTIVO)
 *                tipo:
 *                  type: string
 *                  description: Tipo de area comun
 *                dimension:
 *                  type: number
 *                  description: Tamaño del area comun en m^3
 *                apertura:
 *                  type: time
 *                  description: Hora de apertura del area comun
 *                cierre:
 *                  type: time
 *                  description: Hora de cierre del area comun
 *      responses:
 *        '201':
 *          description: El área comun fue registrado con éxito   
 *        '400':
 *          description: No se pudo registrar el àrea comun
 */


/**
 * @openapi
 *  /api/area-comun/actualizar:
 *    put:
 *      summary: Cambiar datos del àrea comun
 *      description: Devuelve un mensaje de aceptaciòn o de negaciòn
 *      tags:
 *        - Area-comun-administrador
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - id
 *                - nombre
 *                - descripcion
 *                - estado
 *                - tipo
 *                - dimension
 *                - apertura
 *                - cierre
 *              properties:
 *                id:
 *                  type: number
 *                  description: ID único del area comun
 *                nombre:
 *                  type: string
 *                  description: Nombre del area comun
 *                descripcion:
 *                  type: string
 *                  description: Descripcion del area comun
 *                estado:
 *                  type: string
 *                  description: Estado del area comun (ACTIVO, INACTIVO)
 *                tipo:
 *                  type: string
 *                  description: Tipo de area comun
 *                dimension:
 *                  type: number
 *                  description: Tamaño del area comun en m^3
 *                apertura:
 *                  type: time
 *                  description: Hora de apertura del area comun
 *                cierre:
 *                  type: time
 *                  description: Hora de cierre del area comun
 *      responses:
 *        '201':
 *          description: El área comun fue registrado con éxito   
 *        '400':
 *          description: No se pudo registrar el àrea comun
 */

/**
 * @openapi
 *  /api/area-comun/eliminar/:{id}:
 *    delete:
 *      summary: Eliminar el área comun mediante su ID
 *      description: Acepta o niega la eliminación
 *      tags:
 *        - Area-comun-administrador
 *      parameters:
 *        -
 *          in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: number
 *          description: ID del area comun   
 *      responses:
 *        '200':
 *          description: Mensaje de confirmación al eliminar el área comun 
 *        '400':
 *          description: No se pudo eliminar el área comun
 */


/**
 * @openapi
 *  /api/area-comun/reservas/:{id}:
 *    get:
 *      summary: Obtener las reservas hechas por el usuario con ID 
 *      description: Devuelve todas las reservas del usuario
 *      tags:
 *        - Area-comun-usuario
 *      parameters:
 *        -
 *          in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: number
 *          description: ID del usuario
 *      responses:
 *        '200':
 *          description: Conjunto de reservas hechas por el usuario 
 *        '400':
 *          description: El usuario no tiene reservas
 */


/**
 * @openapi
 *  /api/area-comun/residente/reservar:
 *    post:
 *      summary: Registrar un area comun
 *      description: Devuelve un mensaje de aceptación o de negación
 *      tags:
 *        - Area-comun-usuario
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - usuario
 *                - area
 *                - fecha
 *                - inicio
 *                - fin
 *              properties:
 *                usuario:
 *                  type: number
 *                  description: ID del residente
 *                area:
 *                  type: number
 *                  description: ID del area comun
 *                fecha:
 *                  type: date
 *                  description: fecha en la cual fue hecha la reserva (AAAA-MM-DD)
 *                inicio:
 *                  type: time
 *                  description: hora de inicio de la reserva (HH:MM)
 *                fin:
 *                  type: time
 *                  description: hora del fin de la reserva (HH:MM)
 *      responses:
 *        '201':
 *          description: El área comun fue registrado con éxito   
 *        '400':
 *          description: No se pudo registrar el àrea comun
 */

/**
 * @openapi
 *  /api/area-comun/editar-reserva:
 *    put:
 *      summary: Cambiar datos de la reserva
 *      description: Devuelve un mensaje de aceptaciòn o de negaciòn
 *      tags:
 *        - Area-comun-usuario
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - id_reserva
 *                - fecha
 *                - inicio
 *                - fin
 *              properties:
 *                id_reserva:
 *                  type: number
 *                  description: ID único de reserva
 *                fecha:
 *                  type: date
 *                  description: Nueva fecha de la reserva (AAAA-MM-DD)
 *                inicio:
 *                  type: time
 *                  description: Nueva hora de inicio de la reserva (HH:MM)
 *                fin:
 *                  type: time
 *                  description: Nueva hora del fin de la reserva (HH:MM)
 *      responses:
 *        '201':
 *          description: La reserva fue editada con éxito   
 *        '400':
 *          description: No se pudo editar la reserva
 */

/**
 * @openapi
 *  /api/area-comun/eliminar-reserva/:{id}:
 *    delete:
 *      summary: Eliminar reserva
 *      description: Devuelve un mensaje de aceptaciòn o de negaciòn
 *      tags:
 *        - Area-comun-usuario
 *      parameters:
 *        -
 *          in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: number
 *          description: ID de la reserva
 *      responses:
 *        '200':
 *          description: Su reserva fue eliminada   
 *        '400':
 *          description: No fue posible eliminar su reserva
 */

/* Opciones para todos */
router.get("/", obtenerAreas);
router.get("/obtener-area/:id", obtenerArea);

/* Opciones para el administrador */
router.post("/crear", validarTokenAdmin, crearArea);
router.put("/actualizar", validarTokenAdmin, actualizarAreas);
router.delete("/eliminar/:id", validarTokenAdmin, eliminarArea);

/* Opciones para el usuario */
router.get("/residente/reservas/all", /*validarTokenUsuario,*/ obtenerReservasAll);
router.get("/residente/reservas/:id_usuario" /*, validarTokenUsuario*/, obtenerReservas);
router.post("/residente/reservar", /*validarTokenUsuario,*/ reservarArea);
router.put("/residente/editar-reserva", /*validarTokenUsuario,*/ editarReservaArea);
router.delete(
  "/residente/eliminar-reserva/:id",
  validarTokenUsuario,
  eliminarReservaArea
);


const uploadCaptura = multer({ dest: './uploads' }); // Carpeta temporal

router.put("/residente/pagar",uploadCaptura.single("fotografia"),pagarReserva)

/* router.delete("/cancelar-reserva"); */


export { router };
