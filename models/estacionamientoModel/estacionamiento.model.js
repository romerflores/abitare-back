import { db_pool } from "../../helpers/bdConnection.js";

const obtenerParqueosModel = async () => {
    const query = 'SELECT * FROM estacionamiento';
    let disponibles = 0;
    let ocupados = 0;
    let total = 0;
    let porcentajeOcupados = 0;
    try {
        const response = await db_pool.query(query);
        if (!response) throw new Error('No se pudo conectar con el servicio');
        response.rows.forEach(parqueo => {
            if (parqueo.disponibilidad == 'LIBRE') {
                disponibles++
            }
            else if (parqueo.disponibilidad == 'OCUPADO') {
                ocupados++
            }
        });
        total = response.rowCount;
        porcentajeOcupados = parseFloat(((ocupados / total) * 100).toFixed(2));
        const datos = {
            total,
            disponibles,
            ocupados,
            porcentajeOcupados,
            estacionamientos: response.rows
        };
        return datos;
    } catch (e) {
        throw e;
    }
}

const registrarEntradaModel = async (placa, parqueo) => {
    const queryEntrada =
        "INSERT INTO registro_estacionamiento (placa, id_parqueo, fecha_ingreso, fecha_salida) VALUES ($1, $2, NOW(), null)";
    const parametersEntrada = [placa, parqueo];
    const queryDisponibilidad = "UPDATE estacionamiento SET disponibilidad = 'OCUPADO', fecha_cambio_disponibilidad = NOW() WHERE id_parqueo = $1";
    const parametersDisponibilidad = [parqueo];
    try {
        const responseEntrada = await db_pool.query(queryEntrada, parametersEntrada);
        if (!responseEntrada) throw new Error('No se pudo acceder al servicio');
        const responseDisponibilidad = await db_pool.query(queryDisponibilidad, parametersDisponibilidad);
        if (!responseDisponibilidad) throw new Error('No se pudo registrar la entrada');
        return true;
    } catch (e) {
        throw e;
    }
}

const registrarSalidaModel = async (parqueo, registro) => {
    const query = "UPDATE registro_estacionamiento SET fecha_salida = NOW() WHERE id_registro = $1 AND id_parqueo = $2 AND fecha_salida is null";
    const parameters = [registro, parqueo];
    const queryDisponibilidad =
      "UPDATE estacionamiento SET disponibilidad = 'LIBRE', fecha_cambio_disponibilidad = NOW() WHERE id_parqueo = $1";
    const parametersDisponibilidad = [parqueo];
    try {
        const response = await db_pool.query(query, parameters);
        if (!response) throw new Error("No se pudo recurrir al servicio");
        if (!response.rowCount) return false;
        const responseDisponibilidad = await db_pool.query(queryDisponibilidad, parametersDisponibilidad);
        if (!responseDisponibilidad) throw new Error('No se pudo recurrir al servicio');
        if (!responseDisponibilidad.rowCount) return false;
        return true;
    } catch (e) {
        throw e;
    }
}


export { obtenerParqueosModel, registrarEntradaModel, registrarSalidaModel};