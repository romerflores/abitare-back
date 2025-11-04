import { DataTypes } from 'sequelize';
import { sequelize } from '../../helpers/connection.js';

export const Anuncio = sequelize.define('Anuncio', {
titulo: { type: DataTypes.STRING, allowNull: false },
contenido: { type: DataTypes.TEXT, allowNull: false },
autor: { type: DataTypes.STRING, allowNull: true },
fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'anuncios',     // ✅ nombre correcto y claro
  freezeTableName: true           // evita pluralización automática
});
