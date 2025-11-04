import express from "express";
import {Anuncio} from "../../models/comunicacionModel/Anuncio.js";

export const router = express.Router();

// Crear anuncio
router.post("/", async (req, res) => {
  try {
    const { titulo, contenido, autor } = req.body;
    if (!titulo || !contenido)
      return res.status(400).json({ error: "Faltan campos requeridos" });
    const nuevo = await Anuncio.create({ titulo, contenido, autor });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error al crear anuncio" });
  }
});

// Ver todas los anuncios
router.get("/", async (req, res) => {
  try {
    const anuncios = await Anuncio.findAll();
    res.json(anuncios);
  } catch (err) {
    console.error("❌ Error al obtener anuncios:", err);
    res.status(500).json({ error: "Error al obtener anuncios" });
  }
});

// Actualizar anuncio (PUT: reemplazo completo)
router.put("/:id", async (req, res) => {
  try {
    const anuncio = await Anuncio.findByPk(req.params.id);
    if (!anuncio)
      return res.status(404).json({ error: "Anuncio no encontrado" });
    const { titulo, contenido, autor } = req.body;
    anuncio.titulo = titulo;
    anuncio.contenido = contenido;
    anuncio.autor = autor;
    await anuncio.save();
    res.json(anuncio);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar anuncio" });
  }
});

// Patch parcial
router.patch("/:id", async (req, res) => {
  try {
    const anuncio = await Anuncio.findByPk(req.params.id);
    if (!anuncio)
      return res.status(404).json({ error: "Anuncio no encontrado" });
    Object.keys(req.body).forEach((key) => (anuncio[key] = req.body[key]));
    await anuncio.save();
    res.json(anuncio);
  } catch (err) {
    res.status(500).json({ error: "Error al modificar anuncio" });
  }
});

// Eliminar
router.delete("/:id", async (req, res) => {
  try {
    const rows = await Anuncio.destroy({ where: { id: req.params.id } });
    if (!rows) return res.status(404).json({ error: "Anuncio no encontrado" });
    res.json({ mensaje: "Anuncio eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar anuncio" });
  }
});
