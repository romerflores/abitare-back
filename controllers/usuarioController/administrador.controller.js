import nodemailer from "nodemailer";

import {
  validarCorreo,
  validarFecha,
} from "../../helpers/funciones/validador.js";
import { enviarCorreo } from "../../helpers/funciones/enviarEmail.js";
import {
  aAsignarPersonalModel,
  actualizarPersonalModel,
  actualizarResidenteModel,
  aObtenerIncidenteIdModel,
  aObtenerIncidentesModel,
  aObtenerPersonalPorTipoModel,
  eliminarPersonalmodel,
  eliminarResidenteModel,
  obtenerDepartamentosModel,
  obtenerPersonalIdModel,
  obtenerPersonalModel,
  obtenerRegistroVisitasModel,
  obtenerResidenteIdModel,
  obtenerResidentesModel,
  registrarAdminModel,
  registrarPersonalModel,
  registrarResidenteModel,
  registrarVisitaModel,
} from "../../models/usuarioModel/administrador.model.js";
import { generarID } from "../../helpers/funciones/generador.js";

const registrarResidente = async (req, res) => {
  const {
    nombre,
    paterno,
    materno,
    correo,
    ci,
    fecha,
    clave,
    tipo,
    departamento,
  } = req.body;
  if (
    !nombre ||
    !paterno ||
    !materno ||
    !correo ||
    !ci ||
    !fecha ||
    !clave ||
    !tipo ||
    !departamento
  )
    return res.status(400).json({
      message: "Debe llenar todos los campos",
    });
  if (!validarCorreo(correo))
    return res.status(400).json({
      message: "Ingresar un correo válido",
    });
  if (clave != ci)
    return res.status(400).json({
      message: "Para el primer registro, la clave del usuario debe ser su CI",
    });
  if (ci < 100000)
    return res.status(400).json({
      message: "Debe ingresar un CI valido, de al menos 6 digitos",
    });
  try {
    const response = await registrarResidenteModel(
      nombre,
      paterno,
      materno,
      correo,
      ci,
      fecha,
      clave,
      tipo,
      departamento
    );
    if (response) {
      /* Se enviar el correo de confirmacion al residente */
      enviarCorreo(
        correo,
        "alexitoavallejas@gmail.com",
        "Registro de usuario en edificio",
        "Bienvenido a el edificio. Para iniciar sesión debe cambiar de contraseña, su contraseña actual es su número de carnet de identidad"
      );

      return res.status(201).json({
        message: "El usuario fue creado de forma exitosa",
      });
    }
  } catch (e) {
    console.log(e);
    if (e.code == 23505) {
      if (e.length==205) {
        return res.status(400).json({
          message: "El CI ya se encuentra registrado"
        });
      }
      else if (e.length == 235) {
        return res.status(400).json({
          message: "El correo ya se encuentra registrado",
        }); 
      }
    }
    return res.status(500).json({
      message: e.message,
    });
  }
};

const registrarAdmin = async (req, res) => {
  const { nombre, paterno, materno, correo, ci, fecha, clave } = req.body;
  if (!nombre || !paterno || !materno || !correo || !ci || !fecha || !clave)
    return res.status(400).json({
      message: "Debe llenar todos los campos",
    });
  if (!validarCorreo(correo))
    return res.status(400).json({
      message: "Ingresar un correo válido",
    });
  if (clave != ci)
    return res.status(400).json({
      message: "Para el primer registro, la clave del usuario debe ser su CI",
    });
  try {
    const response = await registrarAdminModel(
      nombre,
      paterno,
      materno,
      correo,
      ci,
      clave,
      fecha
    );
    if (response) {
      /* Se enviar el correo de confirmacion al administrador*/
      enviarCorreo(
        correo,
        "alexitoavallejas@gmail.com",
        "Registro de usuario en edificio",
        "Bienvenido a el edificio. Para iniciar sesión debe cambiar de contraseña, su contraseña actual es su número de carnet de identidad"
      );

      return res.status(201).json({
        message: "El usuario fue creado de forma exitosa",
      });
    }
  } catch (e) {
    if (e.code == 23505)
      return res.status(400).json({
        message: e.detail,
      });
    return res.status(500).json({
      message: e.message,
    });
  }
};

const registrarUsuario = async (req, res) => {
  const { tipo, fecha } = req.body;
  if (!validarFecha(fecha))
    return res.status(400).json({
      message: "Ingrese una fecha válida",
    });

  if (tipo.toLowerCase() == "administrador") {
    registrarAdmin(req, res);
  } else if (tipo.toLowerCase() == "residente") {
    registrarResidente(req, res);
  } else {
    return res.status(400).json({
      message: "El tipo de usuario no es válido",
    });
  }
};

const obtenerResidentes = async (req, res) => {
  try {
    const respuesta = await obtenerResidentesModel();
    if (!respuesta)
      return res.status(404).json({
        message: "No hay residentes registrados",
      });
    return res.status(200).json({
      message: "Residentes",
      residentes: respuesta,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

const obtenerResidenteId = async (req, res) => {
  const id = req.params.id.slice(1);
  try {
    const respuesta = await obtenerResidenteIdModel(id);
    if (!respuesta)
      return res.status(404).json({
        message: "No fue posible encontrar al usuario",
      });
    return res.status(200).json({
      residente: respuesta,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

const actualizarResidente = async (req, res) => {
  const { nombre, paterno, materno, correo, ci, fecha, tipo, dpto, usuario } =
    req.body;
  try {
    const respuesta = await actualizarResidenteModel(
      nombre,
      paterno,
      materno,
      correo,
      ci,
      fecha,
      tipo,
      dpto,
      usuario
    );
    if (!respuesta)
      return res.status(400).json({
        message: "No fue posible actualizar los datos del usuario",
      });
    return res.status(200).json({
      message: "Usuario actualizado",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

const eliminarResidente = async (req, res) => {
  const id = req.params.id.slice(1);
  try {
    const respuesta = await eliminarResidenteModel(id);
    if (!respuesta)
      return res.status(401).json({
        message: "No fue posible eliminar al residente",
      });
    return res.status(200).json({
      message: "Usuario eliminado",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

//Departamentos
const obtenerDepartamentos = async (req, res) => {
  try {
    const respuesta = await obtenerDepartamentosModel();
    if (!respuesta)
      return res.status(404).json({
        message: "No hay departamentos",
      });
    return res.status(200).json({
      message: "Departamentos obtenidos",
      departamentos: respuesta,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

//Personal
const obtenerPersonal = async (req, res) => {
  try {
    const respuesta = await obtenerPersonalModel();
    if (!respuesta)
      return res.status(404).json({
        message: "No se encontró ningun personal",
      });
    return res.status(200).json({
      message: "Lista de personal",
      personal: respuesta,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

const obtenerPersonalId = async (req, res) => {
  const id = req.params.id.slice(1);
  try {
    const respuesta = await obtenerPersonalIdModel(id);
    if (!respuesta)
      return res.status(404).json({
        message: "No se encontró personal registrado",
      });
    return res.status(200).json({
      message: "Datos del personal",
      personal: respuesta,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

const registrarPersonal = async (req, res) => {
  const {
    nombre,
    paterno,
    materno,
    ci,
    celular,
    salario,
    email,
    empleo,
    estado = true,
    entrada,
    salida,
  } = req.body;
  if (
    !nombre ||
    !paterno ||
    !materno ||
    !ci ||
    !celular ||
    !salario ||
    !email ||
    !empleo ||
    !entrada ||
    !salida
  )
    return res.status(400).json({
      message: "Debe llenar todos los campos",
    });
  if (!validarCorreo(email))
    return res.status(400).json({
      message: "Ingresar un correo válido",
    });
  const id = generarID(8);
  /* if (clave != ci)
    return res.status(400).json({
      message: "Para el primer registro, la clave del usuario debe ser su CI",
    }); */
  try {
    const response = await registrarPersonalModel(
      id,
      nombre,
      paterno,
      materno,
      ci,
      celular,
      salario,
      email,
      estado,
      entrada,
      salida,
      empleo
    );
    if (response) {
      /* Se enviar el correo de confirmacion al personal */
      /* enviarCorreo(email); */
      return res.status(201).json({
        message: "El usuario fue creado de forma exitosa",
      });
    }
  } catch (e) {
    if (e.code == 23505)
      return res.status(400).json({
        message: "El CI o correo ingresados ya se encuentran registrados",
      });
    return res.status(500).json({
      message: e.message,
    });
  }
};

const actualizarPersonal = async (req, res) => {
  const {
    usuario,
    nombre,
    paterno,
    materno,
    ci,
    celular,
    salario,
    email,
    estado,
    entrada,
    salida,
  } = req.body;
  console.log(req.body);
  try {
    const respuesta = await actualizarPersonalModel(
      usuario,
      nombre,
      paterno,
      materno,
      ci,
      celular,
      salario,
      email,
      estado,
      entrada,
      salida
    );
    if (!respuesta)
      return res.status(400).json({
        message: "No fue posible actualizar los datos del usuario",
      });
    return res.status(200).json({
      message: "Personal actualizado",
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const eliminarPersonal = async (req, res) => {
  const id = req.params.id.slice(1);
  try {
    const respuesta = await eliminarPersonalmodel(id);
    if (!respuesta)
      return res.status(401).json({
        message: "No fue posible eliminar al personal",
      });
    return res.status(200).json({
      message: "Personal eliminado",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

//Registrar visitante - visita
const registrarVisita = async (req, res) => {
  const { ci, nombre, paterno, materno, dpto, asunto } = req.body;
  if (!ci || !nombre || !paterno || !materno || !dpto || !asunto)
    return res.status(400).json({
      message: "Debe llenar todos los campos",
    });
  try {
    const respuesta = await registrarVisitaModel(
      ci,
      nombre,
      paterno,
      materno,
      dpto,
      asunto
    );
    if (!respuesta)
      return res.status(400).json({
        message: "No fue posible registrar la visita",
      });
    return res.status(201).json({
      message: "Visita registrada",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

const obtenerRegistroVisitas = async (req, res) => {
  try {
    const { activos, inactivos } = await obtenerRegistroVisitasModel();
    if (!activos && !inactivos)
      return res.status(404).json({
        message: "No hay registro de visitas",
      });
    return res.status(200).json({
      message: "Registros de visitas",
      activos: activos,
      inactivos: inactivos,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

/* Mantenimiento e incidentes */

export const aObtenerIncidentes = async (req, res) => {
  try {
    const respuesta = await aObtenerIncidentesModel();
    if (!respuesta)
      return res.status(404).json({
        message: "No hay incidentes registrados",
      });
    return res.status(200).json({
      message: "Incidentes registrados",
      incidentes: respuesta,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const aObtenerIncidenteId = async (req, res) => {
  const id = req.params.id.slice(1) || req.params.id;
  try {
    const respuesta = await aObtenerIncidenteIdModel(id);
    if (!respuesta)
      return res.status(404).json({
        message: "No hay incidentes registrados",
      });
    return res.status(200).json({
      message: "Informacion incidente",
      incidente: respuesta,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const aObtenerPersonalPorTipo = async (req, res) => {
  const tipo = req.params.tipo.slice(1); //req.params.tipo;
  try {
    const respuesta = await aObtenerPersonalPorTipoModel(tipo);
    if (!respuesta)
      return res.status(404).json({
        message: "No hay personal para este area",
      });
    return res.status(200).json({
      message: "Personal disponible",
      personal: respuesta,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

export const aAsignarPersonal = async (req, res) => {
  const { ticket, tecnico, usuario } = req.body;
  if (!ticket || !tecnico || !usuario)
    return res.status(400).json({
      message: "Debe enviar el ID del ticket y el nombre completo del personal",
    });
  try {
    const respuesta = await aAsignarPersonalModel(ticket, tecnico);
    if (!respuesta)
      return res.status(400).json({
        message: "No fue posible asignarle el trabajo al personal",
      });
    enviarCorreo(
      usuario,
      "alexitoavallejas@gmail.com",
      "Asignacion de tecnico",
      `Gracias por su paciencia, ya se asignó el/la técnico para solucionar el incidente del ticket ${ticket} `
    );
    return res.status(201).json({
      message: "Personal asignado",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e.message,
    });
  }
};

export {
  registrarUsuario,
  obtenerResidentes,
  obtenerResidenteId,
  actualizarResidente,
  eliminarResidente,
  obtenerDepartamentos,
  obtenerPersonal,
  obtenerPersonalId,
  actualizarPersonal,
  eliminarPersonal,
  registrarPersonal,
  registrarVisita,
  obtenerRegistroVisitas,
};
