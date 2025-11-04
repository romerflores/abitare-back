import express from "express";
import { obtenerConsumosDiarios, obtenerConsumosDiariosId, obtenerInfoServicio, registrarConsumo } from "../controllers/consumo.controller.js";

export const router = express.Router();

router.get("/servicios", obtenerInfoServicio);
router.get("/registros-diarios", obtenerConsumosDiarios);
router.get("/registros-diarios/:id", obtenerConsumosDiariosId);
router.post("/registrar-consumo", registrarConsumo);