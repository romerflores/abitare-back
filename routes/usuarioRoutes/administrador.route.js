import express from "express";
import cookieParser from "cookie-parser";
import { aAsignarPersonal, actualizarPersonal, actualizarResidente, aObtenerIncidenteId, aObtenerIncidentes, aObtenerPersonalPorTipo, eliminarPersonal, eliminarResidente, obtenerDepartamentos, obtenerPersonal, obtenerPersonalId, obtenerRegistroVisitas, obtenerResidenteId, obtenerResidentes, registrarPersonal, registrarUsuario, registrarVisita } from "../../controllers/usuarioController/administrador.controller.js";
import { validarTokenAdmin } from "../../helpers/middlewares/validarToken.js";

const router = express.Router();

/**
 * @openapi
 *  /api/administrador/registrar-usuario:
 *    post:
 *      summary: Cambiar datos del àrea comun
 *      description: Devuelve un mensaje de aceptaciòn o de negaciòn
 *      tags:
 *        - Administrador
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - nombre
 *                - paterno
 *                - materno
 *                - correo
 *                - ci
 *                - fecha
 *                - clave
 *                - tipo
 *                - departamento
 *              properties:
 *                nombre:
 *                  type: string
 *                  description: Nombre o nombres del residente
 *                paterno:
 *                  type: string
 *                  description: Apellido paterno del residente
 *                materno:
 *                  type: string
 *                  description: Apellido materno del residente
 *                correo:
 *                  type: string
 *                  description: Correo del residente
 *                ci:
 *                  type: string
 *                  description: Carnet de identidad del residente
 *                fecha:
 *                  type: date
 *                  description: Fecha de nacimiento del residente en formato AAAA-MM-DD
 *                clave:
 *                  type: string
 *                  description: Primera clave para registrar usuario, en este caso su CI
 *                tipo:
 *                  type: string
 *                  description: Tipo de usuario (presidente, alquiler, etc)
 *                departamento:
 *                  type: number
 *                  description: ID unico del departamento al cual está asociado
 * 
 *      responses:
 *        '201':
 *          description: Mensaje que confirma la creación del usuario
 *        '400':
 *          description: No se pudo registrar al usuario
 */
        
router.get("/obtener-residentes", /* validarTokenAdmin, */ obtenerResidentes);
router.get("/obtener-residente/:id", /* validarTokenAdmin, */ obtenerResidenteId);
router.post("/registrar-usuario", /* validarTokenAdmin, */ registrarUsuario);
router.put("/actualizar-usuario", /* validarTokenAdmin, */ actualizarResidente);
router.delete("/eliminar-residente/:id", /* validarTokenAdmin, */ eliminarResidente);

//Departamentos
router.get("/obtener-departamentos", obtenerDepartamentos);

//Personal
router.get("/obtener-personal", /* validarTokenAdmin, */ obtenerPersonal);
router.get("/obtener-personal/:id", /* validarTokenAdmin, */ obtenerPersonalId);
router.post("/registrar-personal", /* validarTokenAdmin, */ registrarPersonal);
router.put("/actualizar-personal", /* validarTokenAdmin, */ actualizarPersonal);
router.delete("/eliminar-personal/:id", /* validarTokenAdmin, */ eliminarPersonal);

//Visita
router.get("/obtener-registro-visitas", /* validarTokenAdmin, */ obtenerRegistroVisitas);
router.post("/registrar-visita",/*  validarTokenAdmin, */ registrarVisita);

/* Mantenimiento e incidentes */
router.get("/obtener-incidentes", aObtenerIncidentes);
router.get("/obtener-incidente/:id", aObtenerIncidenteId);
router.get("/personal-por-tipo/:tipo", aObtenerPersonalPorTipo);

router.post("/asignar-personal-incidente", aAsignarPersonal);

export { router };
