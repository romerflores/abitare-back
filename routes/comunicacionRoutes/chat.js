import express from "express";
import { MensajeChat } from "../../models/comunicacionModel/MensajeChat.js";

export const router = express.Router();

// Listar mensajes (últimos 100 por ejemplo)
router.get("/", async (req, res) => {
  try {
    const mensajes = await MensajeChat.findAll({
      order: [["fecha", "ASC"]],
      limit: 200,
    });
    res.json(mensajes);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
});

// Enviar mensaje
router.post("/", async (req, res) => {
  const { usuario, mensaje } = req.body;
  if (!usuario || !mensaje)
    return res.status(400).json({ error: "Faltan campos" });
  try {
    const nuevo = await MensajeChat.create({ usuario, mensaje });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
});
