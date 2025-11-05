import { Sequelize } from "sequelize";
import 'dotenv/config.js';

export const sequelize = new Sequelize(
  process.env.PGDATABASE || 'railway', // nombre de la base de datos
  process.env.PGUSER || 'postgres',     // usuario
  process.env.PGPASSWORD || 'rRzFIqQjOsyoxsqZYxCCYiIoHrXotljd', // contraseña
  {
    host: process.env.PGHOST || 'shortline.proxy.rlwy.net', // host de Railway
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 47865, // puerto
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // importante para conexiones externas a Railway
      }
    },
    logging: false // cambiar a true para ver queries
  }
);

// Probar conexión
sequelize.authenticate()
  .then(() => console.log("✅ Conectado a la base de datos Railway"))
  .catch((err) => console.error("❌ Error de conexión:", err));
