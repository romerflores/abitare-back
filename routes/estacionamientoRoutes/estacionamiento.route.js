import express from 'express';
import { obtenerParqueos, registrarEntrada, registrarSalida } from '../../controllers/estacionamientoController/estacionamiento.controller.js';
import { validarTokenAdmin } from '../../helpers/middlewares/validarToken.js';

const router = express.Router();

/**
 * @openapi
 *  /api/estacionamiento/:
 *    get:
 *      summary: Ver todos los espacios de estacionamiento
 *      description: Devuelve datos como espacios disponibles, ocupados, total, porcentaje de ocupados y datos de todos los espacios
 *      tags:
 *        - Estacionamiento   
 *      responses:
 *        '200':
 *          description: Conjunto de todas los espacios de estacionamientos registradas 
 *        '404':
 *          description: No hay espacios registradas
 */

/**
 * @openapi
 *  /api/estacionamiento/registrar-entrada:
 *    post:
 *      summary: Registra entrada de automovil a estacionamiento
 *      description: Devuelve mensaje de confirmacion o de negacion
 *      tags:
 *        - Estacionamiento   
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - placa
 *                          - parqueo
 *                      properties:
 *                          placa:
 *                              type: string
 *                              description: Número de placa del automovil o motocicleta
 *                          parqueo:
 *                              type: string
 *                              description: ID unico del espacio de estacionamiento
 *      responses:
 *        '200':
 *          description: Mensaje de afirmación para entrar al estacionamiento 
 *        '404':
 *          description: Mensaje de error para entrar al estacionamiento
 */

/**
 * @openapi
 *  /api/estacionamiento/registrar-salida:
 *    put :
 *      summary: Actualiza salida de automovil 
 *      description: Devuelve mensaje de confirmacion o de negacion
 *      tags:
 *        - Estacionamiento   
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - parqueo
 *                          - registro
 *                      properties:
 *                          parqueo:
 *                              type: string
 *                              description: ID unico del espacio de estacionamiento
 *                          registro:
 *                              type: number
 *                              description: ID unico del registro del uso del estacionamiento 
 *      responses:
 *        '200':
 *          description: Mensaje de afirmación para salir del estacionamiento 
 *        '404':
 *          description: Mensaje de error para salir del estacionamiento
 */


router.get('/', validarTokenAdmin, obtenerParqueos);
router.post("/registrar-entrada", validarTokenAdmin, registrarEntrada);
router.put('/registrar-salida', validarTokenAdmin, registrarSalida);

export {router};