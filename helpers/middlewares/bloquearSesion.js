import rateLimit from "express-rate-limit";

const TIEMPO_BLOQUEO = 1000 //5*60*1000;
export const bloquearSesion = rateLimit({
  windowMs: TIEMPO_BLOQUEO, //  Duracion de bloqueo
  max: 3,
  message:
    "Demasiados intentos de login. Por favor, inténtalo de nuevo después de 5 minutos.",
  statusCode: 429,
});
