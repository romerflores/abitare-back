import { DataTypes } from "sequelize";
import { sequelize } from "../../helpers/connection.js";

export const MensajeChat = sequelize.define(
  "MensajeChat",
  {
    usuario: { type: DataTypes.STRING, allowNull: false },
    mensaje: { type: DataTypes.TEXT, allowNull: false },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "mensajes_chat", // ✅ nombre correcto y claro
    freezeTableName: true, // evita pluralización automática
  }
);
