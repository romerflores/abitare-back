import { DataTypes } from "sequelize";
import { sequelize } from "../../helpers/connection.js";

export const Votacion = sequelize.define(
  "Votacion",
  {
    pregunta: { type: DataTypes.STRING, allowNull: false },
    opciones: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    votos: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    fechaInicio: { type: DataTypes.DATE, allowNull: true },
    fechaFin: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "votaciones", // 🔥 nombre personalizado en minúsculas
    freezeTableName: true, // evita que Sequelize lo pluralice automáticamente
  }
);
