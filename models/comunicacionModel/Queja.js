import { DataTypes } from "sequelize";
import { sequelize } from "../../helpers/connection.js";

export const Queja = sequelize.define(
  "Queja",
  {
    usuario: { type: DataTypes.STRING, allowNull: false },
    mensaje: { type: DataTypes.TEXT, allowNull: false },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "quejas", // 🔥 nombre personalizado en minúsculas
    freezeTableName: true, // evita que Sequelize lo pluralice automáticamente
  }
);
