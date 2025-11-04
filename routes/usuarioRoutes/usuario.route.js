import express from "express";
import {
  actualizarClave,
  actualizarPrimeraVez,
  generarClaveRecuperacion,
  loginUsuario,
  validarClaveRecuperacion,
  validarCodigo,
} from "../../controllers/usuarioController/usuario.controller.js";
import { bloquearSesion } from "../../helpers/middlewares/bloquearSesion.js";

/**
 * @openapi
 *  /api/usuario/login:
 *    post:
 *      summary: Inicio de sesión de usuarios
 *      description: Retorna un objeto con los datos del usuario logueado
 *      tags:
 *        - Usuarios
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - usuario
 *                - clave
 *                - tipo
 *              properties:
 *                usuario:
 *                  type: string
 *                clave:
 *                  type: string
 *                tipo:
 *                  type: string
 *      responses:
 *        '200':
 *          description: Usuario logueado
 *        '400':
 *          description: Error al iniciar sesion
 */

/**
 * @openapi
 *  /api/usuario/actualizar-primera-vez:
 *    PUTTTTT:
 *      summary: Cambiar de contraseña la primera vez
 *      description: Cambia la contraseña del usuario en la BD
 *      tags:
 *        - Usuarios
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - id_usuario
 *                - clave
 *              properties:
 *                id_usuario:
 *                  type: number
 *                clave:
 *                  type: string
 *      responses:
 *        '201':
 *          description: La contraseña fue actualizada con éxito
 *        '400':
 *          description: Error al cambiar la contraseña
 */

const router = express.Router();

router.post("/login", bloquearSesion, loginUsuario);
router.post("/verificar", validarCodigo);
router.put("/actualizar-primera-vez", actualizarPrimeraVez);

router.post("/cambio-clave", generarClaveRecuperacion);
router.post("/validar-codigo", validarClaveRecuperacion);
router.put("/actualizar-clave", actualizarClave);

router.delete("/logout", (req, res) => {
  req.cookies.cookie_personal && res.clearCookie("cookie_personal").status(200).json({
        message: "Sesion cerrada",
  })
  ||
  req.cookies.cookie_admin && res.clearCookie("cookie_admin").status(200).json({
        message: "Sesion cerrada",
      })
  || req.cookies.cookie_usuario && res.clearCookie("cookie_usuario").status(200).json({
        message: "Sesion cerrada",
      })
});

export { router };
