import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import 'dotenv/config.js';

//Variables
import { PORT_MAIN } from "./helpers/config.js";
import { specs } from "./swagger/swagger.js";

//Rutas importadas
import { router as usuarioRouter } from "./routes/usuarioRoutes/usuario.route.js";
import { router as adminRouter } from "./routes/usuarioRoutes/administrador.route.js";
import { router as areaRouter } from "./routes/areasComunesRoutes/areas.route.js";
import { router as estacionamientoRouter } from "./routes/estacionamientoRoutes/estacionamiento.route.js";
import { router as mantenimientoRouter } from "./routes/matenimientoRoutes/mantenimiento.route.js";
import { router as residenteRouter } from "./routes/usuarioRoutes/residente.route.js";
import { router as incidenteRouter } from "./routes/incidente.route.js";
import { router as tecnicoRouter } from "./routes/usuarioRoutes/personal.route.js";
import { router as dashboardRouter } from "./routes/dashboardRoutes/dashboard.route.js";
import { router as consumoRouter } from "./routes/consumo.route.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middlewares
app.use(
  cors({
    origin: [`http://localhost:10000`, `http://localhost:5173`],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Rutas
app.use("/api/usuario", usuarioRouter);
app.use("/api/administrador", adminRouter);
app.use("/api/residente", residenteRouter);
app.use("/api/tecnico", tecnicoRouter);


app.use("/api/dashboard", dashboardRouter);
app.use("/api/area-comun", areaRouter);
app.use("/api/estacionamiento", estacionamientoRouter);
app.use("/api/mantenimiento", mantenimientoRouter);
app.use("/api/incidente", incidenteRouter);
app.use("/api/consumo", consumoRouter);

app.use("/api-documents", swaggerUI.serve, swaggerUI.setup(specs));

app.use("/public/images", express.static(path.join(__dirname, 'files')));

app.use("/public/comprobantes", express.static(path.join(__dirname, 'comprobantes')));
/* Comunicaciones */

// Conexión a la base de datos

import { sequelize } from "./helpers/connection.js";

// Importar rutas

import { router as anunciosComunicaciones } from './routes/comunicacionRoutes/anuncios.js';
import { router as quejasComunicaciones } from "./routes/comunicacionRoutes/quejas.js";
import { router as votacionComunicaciones } from "./routes/comunicacionRoutes/votaciones.js";
import { router as chatComunicaciones } from "./routes/comunicacionRoutes/chat.js";


app.use('/api/anuncios', anunciosComunicaciones);
app.use("/api/quejas", quejasComunicaciones);
app.use("/api/votaciones", votacionComunicaciones);
app.use("/api/chat", chatComunicaciones);





app.use((req, res, next) => {
  res.status(404).send("Ruta no encontrada");
});

//Instancias servidor
/* app.listen(PORT_MAIN, () => {
  console.log(`Escuchando en: http://localhost:${PORT_MAIN}`);
});
 */

const PORT = process.env.PORT || PORT_MAIN || 3000;

sequelize
  .sync({ alter: false }) // en producción evita modificar estructuras
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al sincronizar la base de datos:", err);
  });
