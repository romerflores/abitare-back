import "dotenv/config";
import jwt from "jsonwebtoken";

import {
  actualizarClaveAdministradorModel,
  actualizarPrimeraClaveAdminModel,
  loginAdministradorModel,
  registrarClaveAdmin,
} from "../../models/usuarioModel/administrador.model.js";
import {
  actualizarClaveResidenteModel,
  actualizarPrimeraClaveResidenteModel,
  loginResidenteModel,
  registrarClave,
  validarCodigoModel,
} from "../../models/usuarioModel/residente.model.js";
import {
  JWT_SECRET_KEY_ADMIN,
  JWT_SECRET_KEY_USER,
  JWT_SECRET_KEY_PERSONAL,
} from "../../helpers/config.js";
import { validarClave } from "../../helpers/funciones/validador.js";
import { generarID } from "../../helpers/funciones/generador.js";
import { enviarCorreo } from "../../helpers/funciones/enviarEmail.js";
import { validarCodigoRecuperacionModel } from "../../models/usuarioModel/usuario.model.js";
import {
  actualizarPrimeraClavePersonalModel,
  loginPersonalModel,
} from "../../models/personal.model.js";

export const validarCodigo = async (req, res) => {
  const { codigo, tipo } = req.body;
  try {
    const response = await validarCodigoModel(codigo);
    if (!response)
      return res.status(401).json({
        message: "El codigo es incorrecto",
      });
    const { correo } = response;

    if (response) {
      if (tipo == "administrador") {
        const token = jwt.sign(
          {
            correo: correo,
          },
          JWT_SECRET_KEY_ADMIN,
          {
            expiresIn: "15m",
          }
        );
        res.cookie("cookie_admin", token, { httpOnly: true });
      }
      if (tipo == "residente") {
        const token = jwt.sign(
          {
            correo: correo,
          },
          JWT_SECRET_KEY_USER,
          {
            expiresIn: "15m",
          }
        );
        res.cookie("cookie_usuario", token, { httpOnly: true });
      }
      if (tipo == "personal") {
        const token = jwt.sign(
          {
            correo: correo,
          },
          JWT_SECRET_KEY_PERSONAL,
          {
            expiresIn: "15m",
          }
        );
        res.cookie("cookie_personal", token, { httpOnly: true });
      }
      return res.status(200).json({
        message: "Inicio de sesion exitoso",
      });
    }
    return res.status(401).json({
      message: "El codigo es incorrecto, inicie sesion",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const loginUsuario = async (req, res) => {
  const { usuario, clave, tipo } = req.body;

  //Validar correo y contraseña antes de entrar a la logica
  if (!usuario)
    return res.status(401).json({
      message: "Debe escribir su correo",
    });
  if (!clave)
    return res.status(401).json({
      message: "Debe escribir su contraseña",
    });
  //Verificar que tipo de usuario es y realizar la accion
  if (tipo == "administrador") {
    try {
      const codigo = generarID(6);
      const response = await loginAdministradorModel(usuario, clave, codigo);
      const { id_administrador, ci } = response;
      if (clave == ci)
        return res.status(200).json({
          message: "El usuario debe cambiar de contraseña",
          change: true,
          id: id_administrador,
          tipo: "administrador",
        });
      const token = jwt.sign(
        {
          id: id_administrador,
          tipo: "administrador",
        },
        JWT_SECRET_KEY_ADMIN,
        {
          expiresIn: "30m",
        }
      );
      if (response) {
        enviarCorreo(
          usuario,
          "alexitoavallejas@gmail.com",
          "Codigo de confirmación",
          `Su código de confirmación es el siguiente: ${codigo}`
        );
        return res.status(200).json({
          message: "Bienvenido administrador",
          token: token,
          id: id_administrador,
          tipo: "administrador",
        });
      }
    } catch (e) {
      return res.status(401).json({
        message: e.message,
      });
    }
  } else if (tipo == "residente") {
    try {
      const codigo = generarID(6);
      const response = await loginResidenteModel(usuario, clave, codigo);
      const { id_residente, ci } = response;
      if (clave == ci)
        return res.status(200).json({
          message: "El usuario debe cambiar de contraseña",
          change: true,
          id: id_residente,
          tipo: "residente",
        });
      if (response) {
        enviarCorreo(
          usuario,
          "alexitoavallejas@gmail.com",
          "Codigo de confirmación",
          `Su código de confirmación es el siguiente: ${codigo}`
        );
        const token = jwt.sign(
          {
            id: id_residente,
            tipo: "residente",
          },
          JWT_SECRET_KEY_ADMIN,
          {
            expiresIn: "15m",
          }
        );
        return res.status(200).json({
          message: "Bienvenido residente",
          id: id_residente,
          tipo: "residente",
          token: token,
        });
      }
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  } else if (tipo == "personal") {
    try {
      const codigo = generarID(6);
      const response = await loginPersonalModel(usuario, clave, codigo);
      const { id_personal, ci } = response;
      if (clave == ci)
        return res.status(200).json({
          message: "El usuario debe cambiar de contraseña",
          change: true,
          id: id_personal,
          tipo: "personal",
        });
      if (response) {
        enviarCorreo(
          usuario,
          "alexitoavallejas@gmail.com",
          "Codigo de confirmación",
          `Su código de confirmación es el siguiente: ${codigo}`
        );
        const token = jwt.sign(
          {
            id: id_personal,
            tipo: "personal",
          },
          JWT_SECRET_KEY_USER,
          {
            expiresIn: "15m",
          }
        );
        return res.status(200).json({
          message: "Bienvenido personal",
          id: id_personal,
          tipo: "personal",
          token: token,
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: e.message,
      });
    }
  } else {
    return res.status(400).json({
      message: "Este tipo de usuario no es válido",
    });
  }
};

export const actualizarPrimeraVez = async (req, res) => {
  const { id_usuario, clave, tipo } = req.body;
  console.log(id_usuario, clave, tipo);
  if (!validarClave(clave))
    return res.status(400).json({
      message:
        "La contraseña debe tener mínimo 8 caracteres, tener al menos un simbolo, una letra mayúscula y un número",
      estado: false,
    });
  try {
    if (tipo == "personal") {
      const response = await actualizarPrimeraClavePersonalModel(
        id_usuario,
        clave
      );
      if (response)
        return res.status(201).json({
          message: "La contraseña fue actualizada de forma exitosa",
          estado: true,
        });
    } else {
      const response = await actualizarPrimeraClaveResidenteModel(
        id_usuario,
        clave
      );
      if (response)
        return res.status(201).json({
          message: "La contraseña fue actualizada de forma exitosa",
          estado: true,
        });
    }
  } catch (e) {
    const response = await actualizarPrimeraClaveAdminModel(id_usuario, clave);
    if (response)
      return res.status(201).json({
        message: "La contraseña fue actualizada de forma exitosa",
        estado: true,
      });
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const generarClaveRecuperacion = async (req, res) => {
  const { usuario, tipo } = req.body;
  const codigo = generarID(8);
  if (!usuario || !tipo)
    return res.status(400).json({
      message:
        "Debe ingresar su correo electronico y seleccionar el tipo de usuario",
    });
  if (tipo == "residente") {
    try {
      const respuesta = await registrarClave(usuario, codigo);
      if (!respuesta)
        return res.status(404).json({
          message: "El usuario no existe",
        });
      enviarCorreo(
        usuario,
        "alexitoavallejas@gmail.com",
        "Codigo de recuperacion",
        `Su código de recuperación es: ${codigo}`
      );
      return res.status(200).json({
        message: "El codigo fue enviado al correo destino",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  } else if (tipo == "administrador") {
    try {
      const respuesta = await registrarClaveAdmin(usuario, codigo);
      if (!respuesta)
        return res.status(404).json({
          message: "El usuario no existe",
        });
      enviarCorreo(
        usuario,
        "alexitoavallejas@gmail.com",
        "Codigo de recuperacion",
        `Su código de recuperación es: ${codigo}`
      );
      return res.status(200).json({
        message: "Revise su correo electronico",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  } else {
    return res.status(400).json({
      message: "El tipo de usuario no existe",
    });
  }
};

export const validarClaveRecuperacion = async (req, res) => {
  const { codigo } = req.body;
  if (!codigo)
    return res.status(400).json({
      message: "Es necesario que escriba el codigo de recuperacion",
    });
  try {
    const respuesta = await validarCodigoRecuperacionModel(codigo);
    if (respuesta)
      return res.status(200).json({
        message: "Puede actualizar su contraseña",
      });
    return res.status(400).json({
      message: "El codigo es incorrecto",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const actualizarClave = async (req, res) => {
  const { clave, tipo, usuario } = req.body;
  if (!validarClave(clave))
    return res.status(400).json({
      message:
        "La contraseña debe ser de al menos 8 caracteres y debe tener al menos: una letra mayuscula, una letra minuscula, un número y un caracter especial",
    });
  if (tipo == "residente") {
    try {
      const respuesta = await actualizarClaveResidenteModel(usuario, clave);
      if (respuesta)
        return res.status(201).json({
          message: "Su clave fue actualizada con exito",
        });
      return res.status(400).json({
        message: "No se pudo actualizar su nueva clave",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  } else if (tipo == "administrador") {
    try {
      const respuesta = await actualizarClaveAdministradorModel(usuario, clave);
      if (respuesta)
        return res.status(201).json({
          message: "Su clave fue actualizada con exito",
        });
      return res.status(400).json({
        message: "No se pudo actualizar su nueva clave",
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  } else {
    return res.status(400).json({
      message: "El tipo de usuario no existe",
    });
  }
};
