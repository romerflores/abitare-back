import nodemailer from "nodemailer";

export const enviarCorreo = async (correoDestino, correoOrigen, asunto, cuerpo) => {
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: correoOrigen,
      pass: "fdnf hyvn ukrj bewj",
    },
  };

  const message = {
    from: correoOrigen,
    to: correoDestino,
    subject: asunto,
    text: cuerpo,
  };

  const transport = nodemailer.createTransport(config);
  const info = await transport.sendMail(message);
};

/* const enviarCorreo = async (correo) => {
  const config = {
    service: "gmail",
    auth: {
      user: "alexitoavallejas@gmail.com",
      pass: "fdnf hyvn ukrj bewj",
    },
  };

  const message = {
    from: "alexitoavallejas@gmail.com",
    to: correo,
    subject: "Registro de usuario en edificio",
    text: "Bienvenido a el edificio. Para iniciar sesión debe cambiar de contraseña, su contraseña actual es su número de carnet de identidad",
  };

  const transport = nodemailer.createTransport(config);
  const info = await transport.sendMail(message);
}; */