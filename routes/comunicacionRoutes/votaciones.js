import express from "express";
import {Votacion} from "../../models/comunicacionModel/Votacion.js";
export const router = express.Router(); 

// Crear votación
router.post("/", async (req, res) => {
  try {
    const { pregunta, opciones, fechaInicio, fechaFin } = req.body;
    if (!pregunta || !Array.isArray(opciones) || opciones.length === 0) {
      return res
        .status(400)
        .json({ error: "Faltan campos o formato incorrecto" });
    }
    // Inicializar votos en 0 para cada opción
    const votosInit = {};
    opciones.forEach((op) => {
      votosInit[op] = 0;
    });
    const nueva = await Votacion.create({
      pregunta,
      opciones,
      votos: votosInit,
      fechaInicio,
      fechaFin,
    });
    res.status(201).json(nueva);
  } catch (err) {
    console.error("❌ Error al crear votación:", err); // 👈 esto mostrará el error real
    res.status(500).json({ error: "Error al crear votación" });
  }
});

// Ver todas las votaciones
router.get("/", async (req, res) => {
  try {
    const votaciones = await Votacion.findAll();
    res.json(votaciones);
  } catch (err) {
    console.error("❌ Error al obtener votaciones:", err);
    res.status(500).json({ error: "Error al obtener votaciones" });
  }
});

// Votar (PATCH)
router.patch("/:id/votar", async (req, res) => {
  try {
    const { opcion } = req.body;
    if (!opcion)
      return res.status(400).json({ error: "Debe enviar la opción" });

    const votacion = await Votacion.findByPk(req.params.id);
    if (!votacion)
      return res.status(404).json({ error: "Votación no encontrada" });

    const votos = { ...votacion.votos };
    votos[opcion] = (votos[opcion] || 0) + 1;

    votacion.set("votos", votos); // 👈 asegura que Sequelize lo detecte
    await votacion.save();

    console.log("✅ Votación actualizada:", votacion.votos);

    res.json({ mensaje: "Voto registrado", votos: votacion.votos });
  } catch (err) {
    res.status(500).json({ error: "Error al registrar voto" });
  }
});

// Eliminar una votación
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la votación
    const votacion = await Votacion.findByPk(id);
    if (!votacion) {
      return res.status(404).json({ error: "Votación no encontrada" });
    }

    // Eliminarla
    await votacion.destroy();

    res.json({ mensaje: "✅ Votación eliminada correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar votación:", err);
    res.status(500).json({ error: "Error al eliminar votación" });
  }
});
