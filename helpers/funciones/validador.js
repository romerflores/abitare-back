const validarCorreo = (correo) => {
    const correoRegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    if (correoRegExp.test(correo)) return true;
    return false;
}

const validarClave = (clave) => {
    const claveRegExp =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-=\[\]{};:'"\\|,.<>\/?~])[A-Za-z\d!@#$%^&*()_+-=\[\]{};:'"\\|,.<>\/?~]{8,}$/;
    if (claveRegExp.test(clave)) return true;
    return false;
}

const validarFecha = (fecha) => {
  const fechaIn = new Date(fecha);
  /* Desestructurar la fecha ingresada */
  const anioIn = fechaIn.getFullYear();
  const mesIn = fechaIn.getMonth();
  const diaIn = fechaIn.getDate()+1;

  const fechaActual = new Date();
  const anioCurrent = fechaActual.getFullYear();
  const mesCurrent = fechaActual.getMonth();
  const diaCurrent = fechaActual.getDate();
  
  if (anioCurrent > anioIn) {
    return true;
  } else if (anioCurrent == anioIn) {
    if (mesCurrent > mesIn) {
      return true;
    } else if (mesCurrent == mesIn) {
      if (diaCurrent >= diaIn) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

const validarFechaReserva = (fecha) => {
  const fechaIn = new Date(fecha);
  /* Desestructurar la fecha ingresada */
  const anioIn = fechaIn.getFullYear();
  const mesIn = fechaIn.getMonth();
  const diaIn = fechaIn.getDate() + 1;

  const fechaActual = new Date();
  const anioCurrent = fechaActual.getFullYear();
  const mesCurrent = fechaActual.getMonth();
  const diaCurrent = fechaActual.getDate();

  if (anioIn < anioCurrent) return false;
  if (anioIn == anioCurrent) {
    if (mesIn < mesCurrent) return false;
    if (mesIn == mesCurrent) {
      if (diaIn < diaCurrent) return false;
    }
  }
  return true;
  
};

export { validarCorreo, validarClave, validarFecha, validarFechaReserva};
