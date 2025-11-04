// controllers/pagos.js
import db from "../db/index.js";

const pagos = {
  // Obtener todos los pagos
  async getAll(req, res) {
    try {
      const result = await db.query("SELECT * FROM pagos ORDER BY id ASC");
      res.json(result.rows); // 🔹 devuelve el array de pagos
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener pagos" });
    }
  },

  // Obtener un pago por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await db.query("SELECT * FROM pagos WHERE id = $1", [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Pago no encontrado" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener pago" });
    }
  },

  // Crear un pago nuevo
  async create(req, res) {
    try {
      const { monto, metodo_pago } = req.body;
      console.log(monto, metodo_pago)
      const result = await db.query(
        "INSERT INTO pagos (monto, metodo_pago) VALUES ($1, $2) RETURNING *",
        [monto, metodo]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear pago" });
    }
  },

  // Actualizar un pago
  async update(req, res) {
    try {
      const { id } = req.params;
      const { monto, metodo } = req.body;
      const result = await db.query(
        "UPDATE pagos SET monto = $1, metodo = $2 WHERE id = $3 RETURNING *",
        [monto, metodo, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar pago" });
    }
  },

  // Eliminar un pago
  async remove(req, res) {
    try {
      const { id } = req.params;
      await db.query("DELETE FROM pagos WHERE id = $1", [id]);
      res.json({ message: "Pago eliminado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar pago" });
    }
  },
};

export default pagos;
