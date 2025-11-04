import jwt from 'jsonwebtoken';

import { JWT_SECRET_KEY_ADMIN, JWT_SECRET_KEY_USER } from "../config.js";

const validarTokenAdmin = (req, res, next) => {
  const cookie = req.cookies.cookie_admin;
  if (!cookie)
    return res.status(401).json({
      message:
        "Mientras no sea administrador, no puede realizar estas acciones",
    });
  if (!jwt.verify(cookie, JWT_SECRET_KEY_ADMIN))
    return res.status(401).json({
      message: "Usted no puede reealizar estas acciones sin un buen token",
    });
  next();
};

const validarTokenUsuario = (req, res, next) => {
  const cookie = req.cookies.cookie_usuario;
  if (!cookie)
    return res.status(401).json({
      message:
        "Mientras no este logueado, no realizar acciones",
    });
  if (!jwt.verify(cookie, JWT_SECRET_KEY_USER))
    return res.status(401).json({
      message: "Usted no puede reealizar estas acciones sin un buen token",
    });
  next();
};

export { validarTokenAdmin, validarTokenUsuario };