import { obtenerParqueosModel, registrarEntradaModel, registrarSalidaModel } from "../../models/estacionamientoModel/estacionamiento.model.js";

const obtenerParqueos = async (req, res) => {
    try {
        const response = await obtenerParqueosModel();
        if (!response) return res.status(500).json({
            message:"Error al obtener el servicio"
        });
        const { total, disponibles, ocupados, porcentajeOcupados, estacionamientos } = response;
        return res.status(200).json({
            total,
            disponibles,
            ocupados,
            porcentajeOcupados,
            estacionamientos
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Error en el servidor'
        });
    }
} 

const registrarEntrada = async (req, res) => {
    const { placa, parqueo} = req.body;
    if (!placa && !parqueo) return res.status(400).json({
        message: 'Debe ingresar todos los campos'
    })
    try {
        const response = await registrarEntradaModel(placa, parqueo);
        if (response) return res.status(201).json({
            message:'Entrada registrada'
        })
    } catch (e) {
        if (e.code == 23503) return res.status(400).json({
            message: 'La placa del vehiculo no se encuentra registrada'
        });
        console.log(e);
        return res.status(500).json({
            message: e.message
        });
    }
}

const registrarSalida = async (req, res) => {
    const { parqueo, registro } = req.body;
    if (!registro && !parqueo)
      return res.status(400).json({
        message: "Debe ingresar todos los campos",
      });
    try {
        const response = await registrarSalidaModel(parqueo, registro);
        if (!response) return res.status(400).json({
            message: 'Ingrese el registro correcto'
        });
        return res.status(201).json({
            message:'La salida fue registrada'
        })
    } catch (e) {
        return res.status(500).json({
          message: e.message,
        });
    }
}

export { obtenerParqueos, registrarEntrada, registrarSalida };