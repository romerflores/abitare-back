import { Router } from "express";
import { obtenerDatosDashboard } from "../../controllers/dashboardController/dashboard.controller.js";

export const router = Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtener datos del dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Datos del dashboard obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", obtenerDatosDashboard);
