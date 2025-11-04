import express from 'express';
import {Queja} from "../../models/comunicacionModel/Queja.js";

export const router = express.Router();


// Listar quejas
router.get('/', async (req, res) => {
try {
const quejas = await Queja.findAll({ order: [['fecha', 'DESC']] });
res.json(quejas);
} catch (err) {
res.status(500).json({ error: 'Error al obtener quejas' });
}
});


// Crear queja
router.post('/', async (req, res) => {
try {
const { usuario, mensaje } = req.body;
if (!usuario || !mensaje) return res.status(400).json({ error: 'Faltan campos' });
const nueva = await Queja.create({ usuario, mensaje });
res.status(201).json(nueva);
} catch (err) {
res.status(500).json({ error: 'Error al crear queja' });
}
});
 